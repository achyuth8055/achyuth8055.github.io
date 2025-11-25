import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import classNames from 'classnames';
import styles from './GmailSidebar.module.scss';

function GmailSidebar({ isOpen, onClose }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Mock email data - replace with actual Gmail API integration
  const mockEmails = [
    {
      id: 1,
      from: 'team@example.com',
      subject: 'Project Update',
      snippet: 'Here is the latest update on the project...',
      date: new Date(),
      read: false,
    },
    {
      id: 2,
      from: 'client@business.com',
      subject: 'Meeting Request',
      snippet: 'Would you be available for a meeting next week?',
      date: new Date(Date.now() - 86400000),
      read: true,
    },
    {
      id: 3,
      from: 'notifications@trello.com',
      subject: 'Card Assigned',
      snippet: 'You have been assigned to a new card...',
      date: new Date(Date.now() - 172800000),
      read: true,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setEmails(mockEmails);
        setLoading(false);
      }, 500);
    }
  }, [isOpen]);

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className={classNames(styles.sidebar, { [styles.open]: isOpen })}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Icon name="mail" />
          <h3>Gmail Inbox</h3>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <Icon name="spinner" loading size="large" />
            <p>Loading emails...</p>
          </div>
        ) : selectedEmail ? (
          <div className={styles.emailDetail}>
            <button className={styles.backButton} onClick={() => setSelectedEmail(null)}>
              <Icon name="arrow left" />
              Back to inbox
            </button>
            <div className={styles.emailHeader}>
              <h4>{selectedEmail.subject}</h4>
              <div className={styles.emailMeta}>
                <span className={styles.from}>{selectedEmail.from}</span>
                <span className={styles.date}>{formatDate(selectedEmail.date)}</span>
              </div>
            </div>
            <div className={styles.emailBody}>
              <p>{selectedEmail.snippet}</p>
              <p>
                This is a full email content preview. In production, this would display the complete
                email content from Gmail API.
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.emailList}>
            {emails.length === 0 ? (
              <div className={styles.empty}>
                <Icon name="inbox" size="huge" />
                <p>No emails</p>
              </div>
            ) : (
              emails.map((email) => (
                <div
                  key={email.id}
                  className={classNames(styles.emailItem, { [styles.unread]: !email.read })}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className={styles.emailFrom}>{email.from}</div>
                  <div className={styles.emailSubject}>{email.subject}</div>
                  <div className={styles.emailSnippet}>{email.snippet}</div>
                  <div className={styles.emailDate}>{formatDate(email.date)}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.openGmail}
        >
          <Icon name="external" />
          Open Gmail
        </a>
      </div>
    </div>
  );
}

GmailSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GmailSidebar;
