import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonLabel,
  IonRow,
  IonItem,
  IonInput,
  useIonRouter,
} from '@ionic/react';
import { loginUser } from '../../../store/actions';
import { request } from '../../../lib/axios';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { authenticateWithFirebase } from '../../../lib/firebase/auth';
<<<<<<< Updated upstream
=======
import { logoGoogle } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';

>>>>>>> Stashed changes
const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();

<<<<<<< Updated upstream
  const handleSignIn = async () => {
=======
  // Sign up check
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const signUpSuccess = queryParams.get('signUpSuccess') === 'true';

  const star_svg = (<svg width="46" height="44" viewBox="0 0 46 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M23 0L23.823 3.36707C25.109 8.62855 25.752 11.2593 27.1233 13.3821C28.336 15.2593 29.9527 16.8418 31.8554 18.0139C34.0071 19.3395 36.651 19.926 41.9388 21.0991L46 22L41.9388 22.9009C36.651 24.074 34.0071 24.6605 31.8554 25.9861C29.9527 27.1582 28.336 28.7407 27.1233 30.6179C25.752 32.7407 25.109 35.3714 23.823 40.6329L23 44L22.177 40.6329C20.891 35.3714 20.248 32.7407 18.8767 30.6179C17.664 28.7407 16.0473 27.1582 14.1446 25.9861C11.9929 24.6605 9.34898 24.074 4.06116 22.9009L0 22L4.06116 21.0991C9.34897 19.926 11.9929 19.3395 14.1446 18.0139C16.0473 16.8418 17.664 15.2593 18.8767 13.3821C20.248 11.2593 20.891 8.62855 22.177 3.36707L23 0Z" fill="black"/>
  </svg>
  )

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
>>>>>>> Stashed changes
    setLoading(true);
    try {
      const response = await request({
        url: '/auth/login',
        method: 'post',
        data: {
          username: username, // Assuming username and email are the same
          password: password,
        },
      });
      // Process the response here
      console.log(response);
      loginUser({ username, token: response.data.token }); // Update the user state
      router.push('/', 'none', 'push');
    } catch (err: any) {
      setError('Username or password is incorrect');
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = () => {
    router.push('/signup', 'none', 'push');
  };
  const googleSignIn = async () => {
    const result = await GoogleAuth.signIn();
    console.info('result', result);
    const token = await authenticateWithFirebase(result.authentication.idToken);
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
  };
  return (
    <IonPage>
<<<<<<< Updated upstream
      <IonContent fullscreen>
        <IonGrid className="absolute top-1/2 w-full -translate-y-1/2">
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  value={username || ''}
                  onIonChange={e => setUsername(e.detail.value || '')}
                  placeholder="Enter username"
                  type="text"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  value={password || ''}
                  onIonChange={e => setPassword(e.detail.value || '')}
                  placeholder="Enter password"
                  type="password"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                mode="ios"
                className="AuthButton"
                shape="round"
                expand="block"
                onClick={handleSignIn}
                disabled={loading}
              >
                Sign In
              </IonButton>
              {error && <p>{error}</p>}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                mode="ios"
                color={'secondary'}
                expand="block"
                shape="round"
                onClick={handleSignUp}
              >
                Sign up
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                mode="ios"
                shape="round"
                className="login-button"
                onClick={() => googleSignIn()}
                expand="block"
                fill="solid"
                color="danger"
              >
                Login with Google
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
=======
    <IonContent fullscreen scrollY={false} className="bg-white flex flex-col items-center justify-center">
      <div className="star-svg-container">
        {star_svg}
      </div>

      <h1 className="login-title">Log in</h1>

      <div className="input-container">
        <IonLabel className="input-label">Username</IonLabel>
        <IonItem lines="none" className="input-item">
          <IonInput value={formData.username}
                    onInput={(e: any) => handleInputChange(e)}
                    type="text"
                    name="username"
                    mode="md"
                    required></IonInput>
        </IonItem>
      </div>

      <div className="input-container">
        <IonLabel className="input-label">Password</IonLabel>
        <IonItem lines="none" className="input-item">
          <IonInput value={formData.password}
                    onInput={(e: any) => handleInputChange(e)}
                    type="password"
                    required
                    name="password"
                    mode="md"></IonInput>
        </IonItem>
      </div>

      <p className="forgot-password">Forgot password?</p>
      
      {error && <p className="error-message">{error}</p>}
      {!error && signUpSuccess && <p className="success-message">Account created successfully</p>}

      <div className="logins-container">
        <IonButton expand="block" className="signin-button" onClick={handleSignIn} disabled={loading}>
          Log In
        </IonButton>

        <div className="or-separator">
          <span>OR</span>
        </div>

        <IonButton expand="block" className="google-sign-in" onClick={() => googleSignIn()} disabled={loading}>
          <IonIcon slot="start" name="logo-google" />
          Sign in with Google
          <IonIcon
                  className="pl-1"
                  slot="end"
                  icon={logoGoogle}
                ></IonIcon>
        </IonButton>
      </div>

      <p className="register-link">
        Don&apos;t have an account? <span onClick={handleSignUp} className='signup-span'>Sign Up</span>
      </p>
    </IonContent>
  </IonPage>
>>>>>>> Stashed changes
  );
};  

export default SignIn;
