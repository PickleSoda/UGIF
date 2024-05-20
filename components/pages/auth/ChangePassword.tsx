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
import { logoGoogle, logoApple, chevronBackOutline } from 'ionicons/icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { SignInWithApple } from '@capacitor-community/apple-sign-in'; import { authenticateWithFirebase } from '../../../lib/firebase/auth';
import { useLocation } from 'react-router-dom';
import ReactCodeInput from "react-code-input"

const ChangePassword = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: ''});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [present, dismiss] = useIonLoading();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useIonRouter();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get('email');
  const verificationCode = query.get('verificationCode');

  useEffect(() => {
    const showHandler = () => setKeyboardVisible(true);
    const hideHandler = () => setKeyboardVisible(false);

    Keyboard.addListener('keyboardWillShow', showHandler);
    Keyboard.addListener('keyboardWillHide', hideHandler);

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

  const handleBack = () => {
    router.push('/forgot-password', 'none', 'push');
  };

  const props = {
    className: 'reactCodeInput',
    type: 'number' as 'number',
    fields: 4,
    name: 'verificationCode',
    inputMode: 'numeric' as 'numeric',
    inputStyle: {
      fontFamily: 'monospace',
      margin: '4px',
      MozAppearance: 'textfield' as 'textfield' | undefined,
      width: `calc((100% - 40px) / 4)`,
      borderRadius: '9px',
      fontSize: '32px',
      height: '70px',
      paddingLeft: '7px',
      paddingRight: '7px',
      textAlign: 'center' as 'center',
      color: '#FFFFFF',
      backgroundColor: 'transparent',
      border: '1px solid #FFFFFF',
    }
  };

  const handleChange = async () => {
    if (!email || !verificationCode || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await request({
        url: 'https://gifs.unclothed.com/auth/reset-password',
        method: 'post',
        data: {
          email: email,
          reset_code: verificationCode,
          new_password: formData.password
        }
      });
      if (response.status === 200) {
        router.push(`/signin?password-changed=true`);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError('Invalid or expired reset code');
      } else {
        setError('An error occurred while verifying the code');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <IonPage>
      <IonHeader mode="ios" className="container">
      </IonHeader>
      <IonContent
        fullscreen
        scrollY={false}
        className="bg-login flex flex-col items-center justify-center"
      >
        <IonButton expand="block" className="back-button" disabled={loading} onClick={handleBack}>
          <IonIcon slot="icon-only" icon={chevronBackOutline}></IonIcon>
        </IonButton>
          
        <h1 className="forgot-title">Reset password</h1>
        <p className='forgot-text'>Please type something you’ll remember</p>

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
            className="forgot-button"
            disabled={loading}
            onClick={handleChange}
          >
            Verify
          </IonButton>
        </div>
        {
          !keyboardVisible && 
          <IonImg src='rect-forgot.png' className="custom-logo-bottom-forgot" />
        }

      </IonContent>
    </IonPage>
  );
};

export default ChangePassword;
