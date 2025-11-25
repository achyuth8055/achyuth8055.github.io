import isEmail from 'validator/lib/isEmail';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { Button, Divider, Form, Grid, Header, Message } from 'semantic-ui-react';
import { useDidUpdate, usePrevious, useToggle } from '../../../lib/hooks';
import { Input } from '../../../lib/custom-ui';

import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import { useForm, useNestedRef } from '../../../hooks';
import { isUsername } from '../../../utils/validator';
import AccessTokenSteps from '../../../constants/AccessTokenSteps';
import TermsModal from './TermsModal';
import api from '../../../api';

import styles from './Content.module.scss';

const createMessage = (error) => {
  if (!error) {
    return error;
  }

  switch (error.message) {
    case 'Invalid credentials':
      return {
        type: 'error',
        content: 'common.invalidCredentials',
      };
    case 'Invalid email or username':
      return {
        type: 'error',
        content: 'common.invalidEmailOrUsername',
      };
    case 'Invalid password':
      return {
        type: 'error',
        content: 'common.invalidPassword',
      };
    case 'Use single sign-on':
      return {
        type: 'error',
        content: 'common.useSingleSignOn',
      };
    case 'Admin login required to initialize instance':
      return {
        type: 'error',
        content: 'common.adminLoginRequiredToInitializeInstance',
      };
    case 'Email already in use':
      return {
        type: 'error',
        content: 'common.emailAlreadyInUse',
      };
    case 'Username already in use':
      return {
        type: 'error',
        content: 'common.usernameAlreadyInUse',
      };
    case 'Active users limit reached':
      return {
        type: 'error',
        content: 'common.activeUsersLimitReached',
      };
    case 'Failed to fetch':
      return {
        type: 'warning',
        content: 'common.noInternetConnection',
      };
    case 'Network request failed':
      return {
        type: 'warning',
        content: 'common.serverConnectionFailed',
      };
    default:
      return {
        type: 'warning',
        content: 'common.unknownError',
      };
  }
};

const Content = React.memo(() => {
  const bootstrap = useSelector(selectors.selectBootstrap);

  const {
    data: defaultData,
    isSubmitting,
    isSubmittingWithOidc,
    error,
    step,
  } = useSelector(selectors.selectAuthenticateForm);

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const wasSubmitting = usePrevious(isSubmitting);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [data, handleFieldChange, setData] = useForm(() => ({
    emailOrUsername: '',
    email: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    ...defaultData,
  }));

  const message = useMemo(() => createMessage(error), [error]);
  const [focusPasswordFieldState, focusPasswordField] = useToggle();

  const [emailOrUsernameFieldRef, handleEmailOrUsernameFieldRef] = useNestedRef('inputRef');
  const [emailFieldRef, handleEmailFieldRef] = useNestedRef('inputRef');
  const [nameFieldRef, handleNameFieldRef] = useNestedRef('inputRef');
  const [usernameFieldRef, handleUsernameFieldRef] = useNestedRef('inputRef');
  const [passwordFieldRef, handlePasswordFieldRef] = useNestedRef('inputRef');
  const [confirmPasswordFieldRef, handleConfirmPasswordFieldRef] = useNestedRef('inputRef');
  const [registrationError, setRegistrationError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (isSignUpMode) {
      // Signup validation
      const cleanData = {
        email: data.email.trim(),
        name: data.name.trim(),
        username: data.username.trim() || undefined,
        password: data.password,
      };

      if (!isEmail(cleanData.email)) {
        emailFieldRef.current.select();
        return;
      }

      if (!cleanData.name) {
        nameFieldRef.current.focus();
        return;
      }

      if (cleanData.username && !isUsername(cleanData.username)) {
        usernameFieldRef.current.select();
        return;
      }

      if (!cleanData.password || cleanData.password.length < 8) {
        passwordFieldRef.current.focus();
        return;
      }

      if (cleanData.password !== data.confirmPassword) {
        confirmPasswordFieldRef.current.focus();
        return;
      }

      try {
        setRegistrationError(null);
        setIsRegistering(true);
        // Register user via API
        const response = await api.registerUser(cleanData);

        // Auto-login with the returned access token
        if (response.included && response.included.accessTokens && response.included.accessTokens[0]) {
          const accessToken = response.included.accessTokens[0].id;
          dispatch(entryActions.handleAuthenticationSuccess({
            accessToken,
            user: response.item,
          }));
        }
      } catch (err) {
        setRegistrationError(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsRegistering(false);
      }
    } else {
      // Login validation
      const cleanData = {
        ...data,
        emailOrUsername: data.emailOrUsername.trim(),
      };

      if (!isEmail(cleanData.emailOrUsername) && !isUsername(cleanData.emailOrUsername)) {
        emailOrUsernameFieldRef.current.select();
        return;
      }

      if (!cleanData.password) {
        passwordFieldRef.current.focus();
        return;
      }

      dispatch(entryActions.authenticate(cleanData));
    }
  }, [dispatch, data, isSignUpMode, emailOrUsernameFieldRef, emailFieldRef, nameFieldRef, usernameFieldRef, passwordFieldRef, confirmPasswordFieldRef]);

  const handleAuthenticateWithOidcClick = useCallback(() => {
    dispatch(entryActions.authenticateWithOidc());
  }, [dispatch]);

  const handleMessageDismiss = useCallback(() => {
    dispatch(entryActions.clearAuthenticateError());
  }, [dispatch]);

  const withOidc = !!bootstrap.oidc;
  const isOidcEnforced = withOidc && bootstrap.oidc.isEnforced;

  const toggleMode = useCallback(() => {
    setIsSignUpMode((prev) => !prev);
    setData({
      emailOrUsername: '',
      email: '',
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
    });
    dispatch(entryActions.clearAuthenticateError());
  }, [setData, dispatch]);

  useEffect(() => {
    if (!isOidcEnforced) {
      if (isSignUpMode) {
        emailFieldRef.current?.focus();
      } else {
        emailOrUsernameFieldRef.current?.focus();
      }
    }
  }, [emailOrUsernameFieldRef, emailFieldRef, isOidcEnforced, isSignUpMode]);

  useDidUpdate(() => {
    if (wasSubmitting && !isSubmitting && error) {
      switch (error.message) {
        case 'Invalid credentials':
        case 'Invalid email or username':
          emailOrUsernameFieldRef.current.select();

          break;
        case 'Invalid password':
          setData((prevData) => ({
            ...prevData,
            password: '',
          }));
          focusPasswordField();

          break;
        default:
      }
    }
  }, [isSubmitting, wasSubmitting, error]);

  useDidUpdate(() => {
    passwordFieldRef.current.focus();
  }, [focusPasswordFieldState]);

  return (
    <div className={classNames(styles.wrapper, styles.fullHeight)}>
      <Grid verticalAlign="middle" className={classNames(styles.grid, styles.fullHeight)}>
        <Grid.Column computer={6} tablet={16} mobile={16}>
          <div className={styles.loginWrapper}>
            <Header as="h1" textAlign="center" content="Fello Card" className={styles.formTitle} />
            <Header
              as="h2"
              textAlign="center"
              content={isSignUpMode ? 'Sign Up' : t('common.logIn', {
                context: 'title',
              })}
              className={styles.formSubtitle}
            />
            <div className={styles.formWrapper}>
              {message && (
                <Message
                  {...{
                    [message.type]: true,
                  }}
                  visible
                  content={t(message.content)}
                  onDismiss={handleMessageDismiss}
                />
              )}
              {registrationError && (
                <Message
                  error
                  visible
                  content={registrationError}
                  onDismiss={() => setRegistrationError(null)}
                />
              )}
              {!isOidcEnforced && (
                <>
                  <Form size="large" onSubmit={handleSubmit}>
                    {isSignUpMode ? (
                      <>
                        <div className={styles.inputWrapper}>
                          <div className={styles.inputLabel}>Email *</div>
                          <Input
                            fluid
                            ref={handleEmailFieldRef}
                            name="email"
                            type="email"
                            value={data.email}
                            maxLength={256}
                            readOnly={isRegistering}
                            className={styles.input}
                            onChange={handleFieldChange}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <div className={styles.inputLabel}>Name *</div>
                          <Input
                            fluid
                            ref={handleNameFieldRef}
                            name="name"
                            value={data.name}
                            maxLength={128}
                            readOnly={isRegistering}
                            className={styles.input}
                            onChange={handleFieldChange}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <div className={styles.inputLabel}>Username (optional)</div>
                          <Input
                            fluid
                            ref={handleUsernameFieldRef}
                            name="username"
                            value={data.username}
                            maxLength={16}
                            readOnly={isRegistering}
                            className={styles.input}
                            onChange={handleFieldChange}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <div className={styles.inputLabel}>Password * (min 8 characters)</div>
                          <Input.Password
                            fluid
                            ref={handlePasswordFieldRef}
                            name="password"
                            value={data.password}
                            maxLength={256}
                            readOnly={isRegistering}
                            className={styles.input}
                            onChange={handleFieldChange}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <div className={styles.inputLabel}>Confirm Password *</div>
                          <Input.Password
                            fluid
                            ref={handleConfirmPasswordFieldRef}
                            name="confirmPassword"
                            value={data.confirmPassword}
                            maxLength={256}
                            readOnly={isRegistering}
                            className={styles.input}
                            onChange={handleFieldChange}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.inputWrapper}>
                          <div className={styles.inputLabel}>{t('common.emailOrUsername')}</div>
                          <Input
                            fluid
                            ref={handleEmailOrUsernameFieldRef}
                            name="emailOrUsername"
                            value={data.emailOrUsername}
                            maxLength={256}
                            readOnly={isSubmitting}
                            className={styles.input}
                            onChange={handleFieldChange}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <div className={styles.inputLabel}>{t('common.password')}</div>
                          <Input.Password
                            fluid
                            ref={handlePasswordFieldRef}
                            name="password"
                            value={data.password}
                            maxLength={256}
                            readOnly={isSubmitting}
                            className={styles.input}
                            onChange={handleFieldChange}
                          />
                        </div>
                      </>
                    )}
                    <Form.Button
                      fluid
                      primary
                      icon="right arrow"
                      labelPosition="right"
                      content={isSignUpMode ? 'Sign Up' : t('action.logIn')}
                      loading={isSignUpMode ? isRegistering : isSubmitting}
                      disabled={isSubmitting || isSubmittingWithOidc || isRegistering}
                    />
                  </Form>
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Button
                      basic
                      fluid
                      content={isSignUpMode ? 'Already have an account? Log In' : 'Don\'t have an account? Sign Up'}
                      onClick={toggleMode}
                      disabled={isSubmitting || isSubmittingWithOidc || isRegistering}
                    />
                  </div>
                  {withOidc && (
                    <Divider horizontal content={t('common.or')} className={styles.divider} />
                  )}
                </>
              )}
              {withOidc && (
                <Button
                  fluid
                  primary={isOidcEnforced}
                  icon={isOidcEnforced ? 'right arrow' : undefined}
                  labelPosition={isOidcEnforced ? 'right' : undefined}
                  content={t('action.logInWithSso')}
                  loading={isSubmittingWithOidc}
                  disabled={isSubmitting || isSubmittingWithOidc}
                  onClick={handleAuthenticateWithOidcClick}
                />
              )}
            </div>
          </div>
        </Grid.Column>
        <Grid.Column
          computer={10}
          only="computer"
          className={classNames(styles.cover, styles.fullHeight)}
        >
          <div className={styles.coverOverlay} />
        </Grid.Column>
      </Grid>
      {step === AccessTokenSteps.ACCEPT_TERMS && <TermsModal />}
    </div>
  );
});

export default Content;
