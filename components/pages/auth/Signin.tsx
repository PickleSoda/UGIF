import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonLabel,
  IonRow,
  IonItem,
  IonToolbar,
  IonIcon,
  IonInput,
  useIonRouter,
  IonImg,
  useIonLoading,
  IonHeader,
} from '@ionic/react';
import { Device } from '@capacitor/device';
import { Keyboard } from '@capacitor/keyboard';
import { loginUser } from '../../../store/actions';
import { request } from '../../../lib/axios';
import { logoGoogle, logoApple } from 'ionicons/icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {
  SignInWithApple,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import {
  authenticateWithFirebase,
  authenticateWithApple,
} from '../../../lib/firebase/auth';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto'; // Node's crypto module

const SignIn = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [present, dismiss] = useIonLoading();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useIonRouter();
  // Sign up check
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const signUpSuccess = queryParams.get('signUpSuccess') === 'true';
  const passwordChanged = queryParams.get('password-changed') === 'true';
  const [showAppleSignIn, setShowAppleSignIn] = useState(false);

  useEffect(() => {
    const showHandler = () => setKeyboardVisible(true);
    const hideHandler = () => setKeyboardVisible(false);

    Keyboard.addListener('keyboardWillShow', showHandler);
    Keyboard.addListener('keyboardWillHide', hideHandler);

    const checkPlatform = async () => {
      const device = await Device.getInfo();
      setShowAppleSignIn(device.platform === 'ios');
    };

    checkPlatform();

    return () => {
      Keyboard.removeAllListeners();
    };
  }, []);

  const star_svg = (
    <svg
      width="46"
      height="44"
      viewBox="0 0 46 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 0L23.823 3.36707C25.109 8.62855 25.752 11.2593 27.1233 13.3821C28.336 15.2593 29.9527 16.8418 31.8554 18.0139C34.0071 19.3395 36.651 19.926 41.9388 21.0991L46 22L41.9388 22.9009C36.651 24.074 34.0071 24.6605 31.8554 25.9861C29.9527 27.1582 28.336 28.7407 27.1233 30.6179C25.752 32.7407 25.109 35.3714 23.823 40.6329L23 44L22.177 40.6329C20.891 35.3714 20.248 32.7407 18.8767 30.6179C17.664 28.7407 16.0473 27.1582 14.1446 25.9861C11.9929 24.6605 9.34898 24.074 4.06116 22.9009L0 22L4.06116 21.0991C9.34897 19.926 11.9929 19.3395 14.1446 18.0139C16.0473 16.8418 17.664 15.2593 18.8767 13.3821C20.248 11.2593 20.891 8.62855 22.177 3.36707L23 0Z"
        fill="white"
      />
    </svg>
  );

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { username, password } = formData;
    if (!username || !password) {
      setError('All fields are required.');
      console.log('Validation failed: All fields are required.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      console.log('Validation failed: Password must be at least 8 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSignIn = async (e: any) => {
    if (!validateForm()) return;
    e.preventDefault();
    setLoading(true);
    try {
      const { username, password } = formData;
      present({
        message: 'Signing in...',
        duration: 3000,
      });
      const response = await request({
        url: '/auth/login',
        method: 'post',
        data: { username, password },
      });
      console.log(response);
      loginUser({ username, token: response.data.token });
      router.push('/', 'none', 'push');
    } catch (err: any) {
      setError('Username or password is incorrect');
    } finally {
      dismiss();
      setLoading(false);
    }
  };
  const handleSignUp = () => {
    router.push('/signup', 'none', 'push');
  };

  const handleForgot = () => {
    router.push('/forgot-password', 'none', 'push');
  };

  const googleSignIn = async () => {
    try {
      const result = await GoogleAuth.signIn();
      present({
        message: 'Signing in...',
        duration: 10000,
      });
      console.info('result', result);
      const token = await authenticateWithFirebase(
        result.authentication.idToken,
      );
      const response = await request({
        url: '/auth/google_signin',
        method: 'post',
        data: {
          id_token: token,
        },
      });
      console.info('response', response);
      loginUser({ username: result.email, token: response.data.token });
      if (result) {
        router.push('/', 'none', 'push');
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    } finally {
      dismiss();
    }
  };

  async function sha256(message: string) {
    return crypto.createHash('sha256').update(message).digest('hex');
  }

  const appleSignIn = async () => {
    const nonce = uuidv4(); // Generate a secure random nonce
    const hashedNonceHex = await sha256(nonce); // Hash the nonce

    let options: any = {
      clientId: 'com.starswap.gif',
      redirectURI: 'https://starswap-91cd8.firebaseapp.com/__/auth/handler',
      scopes: 'email name',
      state: '12345',
      nonce: hashedNonceHex,
    };

    try {
      const result = await SignInWithApple.authorize(options);
      present({
        message: 'Signing in...',
        duration: 10000,
      });
      console.info('result', result);

      const { identityToken, authorizationCode, email } = result.response;

      const token = await authenticateWithApple(identityToken, nonce);

      const response = await request({
        url: '/auth/google_signin',
        method: 'post',
        data: {
          id_token: token,
        },
      });
      console.info('response', response);

      const userEmail = email ?? 'unknown@example.com';
      loginUser({ username: userEmail, token: response.data.token });

      if (result) {
        router.push('/', 'none', 'push');
      }
    } catch (error) {
      console.error('Error during Apple sign-in:', error);
    } finally {
      dismiss();
    }
  };

  return (
    <IonPage>
      <IonHeader mode="ios" className="container">
        <IonToolbar className="custom-toolbar">
          <div className="star-svg-container">{star_svg}</div>
        </IonToolbar>
      </IonHeader>
      <IonContent
        fullscreen
        scrollY={false}
        className="bg-login flex flex-col items-center justify-center"
      >
        <IonImg src="rect-log.png" className="custom-logo" />

        <h1 className="login-title">Log in</h1>

        <div className="input-container">
          <IonLabel className="input-label">Username</IonLabel>
          <IonItem lines="none" className="input-item">
            <IonInput
              value={formData.username}
              onInput={(e: any) => handleInputChange(e)}
              type="text"
              name="username"
              mode="md"
              required
            ></IonInput>
          </IonItem>
        </div>

        <div className="input-container">
          <IonLabel className="input-label">Password</IonLabel>
          <IonItem lines="none" className="input-item">
            <IonInput
              value={formData.password}
              onInput={(e: any) => handleInputChange(e)}
              type="password"
              required
              name="password"
              mode="md"
            ></IonInput>
          </IonItem>
        </div>

        <p className="forgot-password" onClick={handleForgot}>
          Forgot password?
        </p>

        {error && <p className="error-message">{error}</p>}
        {!error && signUpSuccess && (
          <p className="success-message">Account created successfully</p>
        )}
        {passwordChanged && (
          <p className="success-message">Password changed successfully</p>
        )}

        <div className="logins-container">
          <IonButton
            expand="block"
            className="signin-button"
            onClick={handleSignIn}
            disabled={loading}
          >
            Log In
          </IonButton>

          <div className="or-separator">
            <span>OR</span>
          </div>

          {showAppleSignIn ? (
            <IonButton
              expand="block"
              className="google-sign-in"
              onClick={() => appleSignIn()}
              disabled={loading}
            >
              Sign up with Apple
              <IonIcon className="pl-1" slot="end" icon={logoApple}></IonIcon>
            </IonButton>
          ) : (
            <IonButton
              expand="block"
              className="google-sign-in"
              onClick={() => googleSignIn()}
              disabled={loading}
            >
              Sign up with Google
              <IonIcon className="pl-1" slot="end" icon={logoGoogle}></IonIcon>
            </IonButton>
          )}
        </div>

        {!keyboardVisible && (
          <IonImg src="rect-forgot.png" className="custom-logo-bottom" />
        )}

        <p className={`register-link ${keyboardVisible ? 'hidden' : ''}`}>
          Don&apos;t have an account?{' '}
          <span onClick={handleSignUp} className="signup-span">
            Sign Up
          </span>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
