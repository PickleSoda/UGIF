import React, { useState } from 'react';
// import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
// import firebase_app from '../../../lib/firebase/config';
import { signInWithGoogle } from '../../../lib/firebase/auth';
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonInput,
  useIonRouter,
} from '@ionic/react';
import { loginUser } from '../../../store/actions';
import { request } from '../../../lib/axios';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();

  const handleSignIn = async () => {
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
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = () => {
    router.push('/signup', 'none', 'push');
  };
  const hanldeGoogleSignin = async () => {

    const result = await signInWithGoogle()
    // const result = await FirebaseAuthentication.signInWithGoogle();
    // console.info('result', result.user.getIdToken());

    console.log('result', result.user?.email, result.token)
    const response = await request({
      url: '/auth/google_signin',
      method: 'post',
      data: {
        id_token: result.token,
      },
    });
    console.info('response', response);
    loginUser({ username: result.user?.email || '', token: response.data.token });
    if (result) {
      router.push('/', 'none', 'push');
    }
  };
  return (
    <IonPage>
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
                >
                </IonInput>
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
                color="danger"
                expand="block"
                shape='round'
                onClick={() => hanldeGoogleSignin()}
                >
                Login with Google
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
