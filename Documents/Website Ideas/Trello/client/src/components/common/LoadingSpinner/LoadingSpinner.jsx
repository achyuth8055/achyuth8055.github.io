import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Loader, Dimmer } from 'semantic-ui-react';
import styles from './LoadingSpinner.module.scss';

function LoadingSpinner({
  size = 'medium',
  fullScreen = false,
  message = 'Loading...',
  overlay = false,
}) {
  const spinnerClass = classNames(styles.spinner, {
    [styles.small]: size === 'small',
    [styles.medium]: size === 'medium',
    [styles.large]: size === 'large',
    [styles.fullScreen]: fullScreen,
    [styles.overlay]: overlay,
  });

  if (fullScreen) {
    return (
      <div className={styles.fullScreenContainer}>
        <div className={styles.spinnerWrapper}>
          <div className={styles.trelloSpinner}>
            <div className={styles.spinnerDot} />
            <div className={styles.spinnerDot} />
            <div className={styles.spinnerDot} />
            <div className={styles.spinnerDot} />
          </div>
          {message && <p className={styles.loadingMessage}>{message}</p>}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <Dimmer active inverted className={styles.dimmerOverlay}>
        <Loader size={size} content={message} className={styles.loader} />
      </Dimmer>
    );
  }

  return (
    <div className={spinnerClass}>
      <Loader active inline="centered" size={size} content={message} />
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullScreen: PropTypes.bool,
  message: PropTypes.string,
  overlay: PropTypes.bool,
};

export default LoadingSpinner;
