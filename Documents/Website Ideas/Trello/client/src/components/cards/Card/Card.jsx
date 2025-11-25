
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { push } from '../../../lib/redux-router';
import { closePopup, usePopup } from '../../../lib/popup';

import selectors from '../../../selectors';
import Paths from '../../../constants/Paths';
import { BoardMembershipRoles, CardTypes } from '../../../constants/Enums';
import ProjectContent from './ProjectContent';
import StoryContent from './StoryContent';
import InlineContent from './InlineContent';
import EditName from './EditName';
import ActionsStep from './ActionsStep';

import styles from './Card.module.scss';
import globalStyles from '../../../styles.module.scss';

const Card = React.memo(({ id, isInline }) => {
  const selectCardById = useMemo(() => selectors.makeSelectCardById(), []);
  const selectIsCardWithIdRecent = useMemo(() => selectors.makeSelectIsCardWithIdRecent(), []);
  const selectListById = useMemo(() => selectors.makeSelectListById(), []);

  const card = useSelector((state) => selectCardById(state, id));
  const list = useSelector((state) => selectListById(state, card.listId));

  const isHighlightedAsRecent = useSelector((state) => {
    const { turnOffRecentCardHighlighting } = selectors.selectCurrentUser(state);

    if (turnOffRecentCardHighlighting) {
      return false;
    }

    return selectIsCardWithIdRecent(state, id);
  });

  const canUseActions = useSelector((state) => {
    const boardMembership = selectors.selectCurrentUserMembershipForCurrentBoard(state);
    return !!boardMembership && boardMembership.role === BoardMembershipRoles.EDITOR;
  });

  const dispatch = useDispatch();
  const [isEditNameOpened, setIsEditNameOpened] = useState(false);

  const actionsPopupRef = useRef(null);

  const handleClick = useCallback(() => {
    if (document.activeElement) {
      document.activeElement.blur();
    }

    dispatch(push(Paths.CARDS.replace(':id', id)));
  }, [id, dispatch]);

  const handleContextMenu = useCallback((event) => {
    if (!actionsPopupRef.current) {
      return;
    }

    event.preventDefault();

    closePopup();
    actionsPopupRef.current.open();
  }, []);

  const handleNameEdit = useCallback(() => {
    setIsEditNameOpened(true);
  }, []);

  const handleEditNameClose = useCallback(() => {
    setIsEditNameOpened(false);
  }, []);

  const ActionsPopup = usePopup(ActionsStep);

  if (isEditNameOpened) {
    return <EditName cardId={id} onClose={handleEditNameClose} />;
  }

  let Content;
  if (isInline) {
    Content = InlineContent;
  } else {
    switch (card.type) {
      case CardTypes.PROJECT:
        Content = ProjectContent;

        break;
      case CardTypes.STORY:
        Content = StoryContent;

        break;
      default:
    }
  }

  const colorLineNode = list.color && (
    <div
      className={classNames(
        styles.colorLine,
        globalStyles[`background${upperFirst(camelCase(list.color))}`],
      )}
    />
  );

  return (
    <div
      className={classNames(styles.wrapper, isHighlightedAsRecent && styles.wrapperRecent, 'card')}
    >
      {card.isPersisted ? (
        <>
          <div
            className={classNames(styles.content, card.isClosed && styles.contentDisabled)}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            role="button"
            tabIndex={0}
            aria-label={`Open card: ${card.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }}
          >
            <Content cardId={id} />
            {colorLineNode}
          </div>
          {canUseActions && (
            <ActionsPopup ref={actionsPopupRef} cardId={id} onNameEdit={handleNameEdit}>
              <Button
                className={styles.actionsButton}
                aria-label={`Card actions for ${card.name}`}
              >
                <Icon fitted name="pencil" size="small" />
              </Button>
            </ActionsPopup>
          )}
        </>
      ) : (
        <span className={classNames(styles.content, card.isClosed && styles.contentDisabled)}>
          <Content cardId={id} />
          {colorLineNode}
        </span>
      )}
    </div>
  );
});

Card.propTypes = {
  id: PropTypes.string.isRequired,
  isInline: PropTypes.bool,
};

Card.defaultProps = {
  isInline: false,
};

export default Card;
