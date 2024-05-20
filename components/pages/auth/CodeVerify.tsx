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
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { authenticateWithFirebase } from '../../../lib/firebase/auth';
import { useLocation } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';

const CodeVerify = () => {
  const [formData, setFormData] = useState({ verificationCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [present, dismiss] = useIonLoading();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useIonRouter();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get('email');

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

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    },
  };

  const handleVerify = async () => {
    if (!email || !formData.verificationCode) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await request({
        url: 'https://gifs.unclothed.com/auth/verify-reset-code',
        method: 'post',
        data: {
          email: email,
          reset_code: formData.verificationCode,
        },
      });
      if (response.status === 200) {
        router.push(
          `/change-password?email=${encodeURIComponent(email)}&verificationCode=${formData.verificationCode}`,
        );
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

  const handleCodeChange = (code: any) => {
    setFormData(prev => ({ ...prev, verificationCode: code }));
  };

  return (
    <IonPage>
      <IonHeader mode="ios" className="container"></IonHeader>
      <IonContent
        fullscreen
        scrollY={false}
        className="bg-login flex flex-col items-center justify-center"
      >
        <IonButton
          expand="block"
          className="back-button"
          disabled={loading}
          onClick={handleBack}
        >
          <IonIcon slot="icon-only" icon={chevronBackOutline}></IonIcon>
        </IonButton>

        <h1 className="forgot-title">Please check your email</h1>
        <p className="forgot-text">We’ve sent a code to {email}</p>

        <div className="input-container">
          <div className="input-code">
            <ReactCodeInput {...props} onChange={handleCodeChange} />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        <div className="logins-container">
          <IonButton
            expand="block"
            className="forgot-button"
            disabled={loading}
            onClick={handleVerify}
          >
            Verify
          </IonButton>
        </div>
        {!keyboardVisible && (
          <IonImg src="rect-forgot.png" className="custom-logo-bottom-forgot" />
        )}
      </IonContent>
    </IonPage>
  );
};

export default CodeVerify;
