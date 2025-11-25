import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Icon, Popup } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import BoardSwitcher from '../BoardSwitcher';
import NotificationsStep from '../../notifications/NotificationsStep';
import { usePopup } from '../../../lib/popup';
import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import styles from './BottomNav.module.scss';

const BottomNav = ({ onGmailToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const currentUser = useSelector(selectors.selectCurrentUser);

  const NotificationsPopup = usePopup(NotificationsStep, {
    position: 'top center',
    on: 'click',
  });

  const isActive = (path) => location.pathname.includes(path);

  const navItems = [
    {
      id: 'home',
      icon: 'home',
      label: 'Home',
      path: '/',
      tooltip: 'Go to home',
    },
    {
      id: 'boards',
      icon: 'trello',
      label: 'Boards',
      component: 'switcher',
      tooltip: 'Switch boards (⌘K)',
    },
    {
      id: 'gmail',
      icon: 'mail',
      label: 'Gmail',
      action: 'gmail',
      tooltip: 'Toggle Gmail inbox',
    },
    {
      id: 'notifications',
      icon: 'bell outline',
      label: 'Notifications',
      action: 'notifications',
      tooltip: 'View notifications',
      badge: 0, // Can be dynamic
    },
    {
      id: 'profile',
      icon: 'user circle',
      label: currentUser?.name?.split(' ')[0] || 'Profile',
      action: 'profile',
      tooltip: 'Your profile & settings',
    },
  ];

  const handleNavClick = useCallback((item) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.action === 'gmail') {
      if (onGmailToggle) {
        onGmailToggle();
      }
    } else if (item.action === 'profile') {
      dispatch(entryActions.openUserSettingsModal());
    }
    // notifications action is handled by NotificationsPopup wrapper
  }, [navigate, onGmailToggle, dispatch]);

  return (
    <nav
      className={classNames(styles.bottomNav, { [styles.expanded]: isExpanded })}
      role="navigation"
      aria-label="Bottom navigation bar"
    >
      <div className={styles.navContainer}>
        {/* Toggle button for mobile */}
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
          aria-expanded={isExpanded}
        >
          <Icon name={isExpanded ? 'chevron down' : 'chevron up'} />
        </button>

        {/* Navigation items */}
        <div className={styles.navItems}>
          {navItems.map((item) => {
            if (item.component === 'switcher') {
              return (
                <div key={item.id} className={styles.navItem}>
                  <BoardSwitcher />
                </div>
              );
            }

            const isItemActive = item.path && isActive(item.path);
            const buttonContent = (
              <button
                className={classNames(styles.navButton, {
                  [styles.active]: isItemActive,
                })}
                onClick={() => item.action !== 'notifications' && handleNavClick(item)}
                aria-label={item.label}
                aria-current={isItemActive ? 'page' : undefined}
              >
                <div className={styles.iconContainer}>
                  <Icon name={item.icon} />
                  {item.badge > 0 && (
                    <span className={styles.badge} aria-label={`${item.badge} ${item.label.toLowerCase()}`}>{item.badge}</span>
                  )}
                </div>
                <span className={styles.label}>{item.label}</span>
              </button>
            );

            if (item.action === 'notifications') {
              return (
                <NotificationsPopup key={item.id}>
                  <Popup
                    content={item.tooltip}
                    position="top center"
                    size="tiny"
                    inverted
                    on="hover"
                    trigger={buttonContent}
                  />
                </NotificationsPopup>
              );
            }

            return (
              <Popup
                key={item.id}
                content={item.tooltip}
                position="top center"
                size="tiny"
                inverted
                on="hover"
                trigger={buttonContent}
              />
            );
          })}
        </div>

        {/* Quick actions */}
        <div className={styles.quickActions}>
          <Popup
            content="Go to home to create board"
            position="top center"
            size="tiny"
            inverted
            trigger={
              <button
                className={styles.createButton}
                onClick={() => navigate('/')}
                aria-label="Create new board"
              >
                <Icon name="plus" />
                <span>Create</span>
              </button>
            }
          />
        </div>
      </div>
    </nav>
  );
};

BottomNav.propTypes = {
  onGmailToggle: PropTypes.func,
};

BottomNav.defaultProps = {
  onGmailToggle: undefined,
};

export default BottomNav;
