import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonIcon,
  IonInput,
  IonLabel,
  useIonLoading,
  useIonRouter,
} from '@ionic/react';
import { request } from '../../../lib/axios';
import { logoGoogle } from 'ionicons/icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { authenticateWithFirebase } from '../../../lib/firebase/auth';
import { loginUser } from '../../../store/actions';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();
  const [present, dismiss] = useIonLoading();

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
        fill="black"
      />
    </svg>
  );

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username || !email || !password) {
      setError('All fields are required.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await request({
        url: '/auth/register',
        method: 'post',
        data: formData,
      });
      console.log(response);
      router.push('/signin?signUpSuccess=true', 'forward', 'replace');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/signin', 'none', 'push');
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

  return (
    <IonPage>
      <IonContent
        fullscreen
        scrollY={false}
        className="bg-white flex flex-col items-center justify-center"
      >
        <div className="star-svg-container">{star_svg}</div>

        <h1 className="login-title">Sign up</h1>

        <div className="input-container">
          <IonLabel className="input-label">Email</IonLabel>
          <IonItem lines="none" className="input-item">
            <IonInput
              value={formData.email}
              onInput={(e: any) => handleInputChange(e)}
              type="email"
              name="email"
              mode="md"
              required
            ></IonInput>
          </IonItem>
        </div>

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

        <div className="input-container">
          <IonLabel className="input-label">Confirm Password</IonLabel>
          <IonItem lines="none" className="input-item">
            <IonInput
              value={formData.confirmPassword}
              onInput={(e: any) => handleInputChange(e)}
              type="password"
              required
              name="confirmPassword"
              mode="md"
            ></IonInput>
          </IonItem>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="logins-container">
          <IonButton
            expand="block"
            className="signin-button"
            onClick={handleSignUp}
            disabled={loading}
          >
            Sign up
          </IonButton>

          <div className="or-separator">
            <span>OR</span>
          </div>

          <IonButton
            expand="block"
            className="google-sign-in"
            onClick={() => googleSignIn()}
            disabled={loading}
          >
            <IonIcon slot="start" name="logo-google" />
            Sign up with Google
            <IonIcon className="pl-1" slot="end" icon={logoGoogle}></IonIcon>
          </IonButton>
        </div>

        <p className="register-link">
          Already have an account?{' '}
          <span onClick={handleSignIn} className="signup-span">
            Sign In
          </span>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
