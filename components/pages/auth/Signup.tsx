import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonCol, // Add this import statement
  IonRow,
  IonItem,
  IonInput,
  useIonRouter,
} from '@ionic/react';
import { request } from '../../../lib/axios';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await request({
        url: '/auth/register',
        method: 'post',
        data: {
          username: username,
          email: email,
          password: password,
        },
      });
      // Process the response here
      console.log(response);
      router.push('/login', 'forward', 'replace'); // Redirect to login on successful sign-up
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };
  const handleSignIn = () => {
    router.push('/signin', 'none', 'push');
  };
  return (
    <IonPage>
      <IonContent>
        <div className="bg-gradient-to-r from-purple-700 to-blue-700 h-full w-full"></div>
        <div className="absolute top-1/4 -translate-y-3/4 p-4 w-full max-w-xl translate-x-1/2 right-1/2">
          <div className="text-white text-3xl font-bold text-start">
            Welcome to <br />
            <span className="text-5xl">STAR</span>{' '}
            <span className="text-5xl">Swap</span>
          </div>
        </div>
        <IonGrid className="absolute bottom-1/4 w-full max-w-xl translate-y-1/4 translate-x-1/2 right-1/2 font-semibold bg-gradient-to-r from-purple-700 to-blue-700">
          <IonRow>
            <IonCol>
              <div className="bg-gray-100 text-black  shadow-inner  py-1 px-10 rounded-full">
                <IonInput
                  value={username || ''}
                  onIonChange={e => setUsername(e.detail.value || '')}
                  placeholder="Enter username"
                  type="text"
                  name="username"
                  mode="md"
                ></IonInput>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="bg-gray-100 text-black  shadow-inner  py-1 px-10 rounded-full">
                <IonInput
                  value={email || ''}
                  onIonChange={e => setEmail(e.detail.value || '')}
                  placeholder="Enter email"
                  type="email"
                  mode="md"
                ></IonInput>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="bg-gray-100 text-black  shadow-inner  py-1 px-10 rounded-full">
                <IonInput
                  value={password || ''}
                  onIonChange={e => setPassword(e.detail.value || '')}
                  placeholder="Enter password"
                  type="password"
                  mode="md"
                ></IonInput>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="bg-gray-100 text-black  shadow-inner  py-1 px-10 rounded-full">
                <IonInput
                  value={confirmPassword || ''}
                  onIonChange={e => setConfirmPassword(e.detail.value || '')}
                  placeholder="Confirm password"
                  type="password"
                  mode="md"
                ></IonInput>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                mode="ios"
                expand="block"
                shape="round"
                onClick={handleSignUp}
                disabled={loading}
              >
                <p className="font-bold">Sign Up</p>
              </IonButton>
              {error && <p>{error}</p>}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="text-sm text-center flex px-8 opacity-50">
                <div className="w-full h-0.5 bg-white mt-2"></div>
                <p className="px-1 text-white">OR</p>
                <div className="w-full h-0.5 bg-white mt-2"></div>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                mode="ios"
                color={'secondary'}
                expand="block"
                onClick={handleSignIn}
              >
                <p className="font-bold">Sign in</p>
              </IonButton>
              {error && <p>{error}</p>}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
