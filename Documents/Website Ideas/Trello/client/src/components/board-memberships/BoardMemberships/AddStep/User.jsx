
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import selectors from '../../../../selectors';
import UserAvatar from '../../../users/UserAvatar';

import styles from './User.module.scss';

const User = React.memo(({ id, isActive, onSelect }) => {
  const selectUserById = useMemo(() => selectors.makeSelectUserById(), []);

  const user = useSelector((state) => selectUserById(state, id));

  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  return (
    <button type="button" disabled={isActive} className={styles.menuItem} onClick={handleClick}>
      <span className={styles.user}>
        <UserAvatar id={id} />
      </span>
      <div className={classNames(styles.menuItemText, isActive && styles.menuItemTextActive)}>
        <div className={styles.userName}>{user.name}</div>
        {(user.email || user.username) && (
          <div className={styles.userSubtext}>
            {user.email || `@${user.username}`}
          </div>
        )}
      </div>
    </button>
  );
});

User.propTypes = {
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default User;
