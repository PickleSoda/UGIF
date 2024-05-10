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
  useIonRouter,
  useIonLoading,
} from '@ionic/react';
import { loginUser } from '../../../store/actions';
import { request } from '../../../lib/axios';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { authenticateWithFirebase } from '../../../lib/firebase/auth';
import { logoGoogle } from 'ionicons/icons';
const SignIn = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [present, dismiss] = useIonLoading();
  const router = useIonRouter();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e: any) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    try {
      const { username, password } = formData;
      present({
        message: 'Signing in...',
        duration: 10000,
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
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = () => {
    router.push('/signup', 'none', 'push');
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
      <IonContent fullscreen>
        <div className="bg-gradient-to-r from-purple-700 to-blue-700 h-full w-full"></div>
        <div className="absolute top-1/4 -translate-y-3/4 p-4 w-full max-w-xl translate-x-1/2 right-1/2">
          <div className="text-white text-3xl font-bold text-start">
            Welcome to <br />
            <span className="text-5xl">STAR</span>{' '}
            <span className="text-5xl">Swap</span>
          </div>
        </div>
        <IonGrid className="absolute bottom-1/4 w-full translate-y-1/4 max-w-xl translate-x-1/2 right-1/2 font-semibold bg-gradient-to-r from-purple-700 to-blue-700">
          <IonRow>
            <IonCol>
              <div className="bg-gray-100 text-black py-1 px-10 shadow-inner rounded-full">
                <IonInput
                  value={formData.username}
                  onInput={handleInputChange}
                  placeholder="Enter username"
                  type="text"
                  name="username"
                  mode="md"
                />
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="bg-gray-100 text-black  shadow-inner  py-1 px-10 rounded-full">
                <IonInput
                  value={formData.password}
                  onInput={handleInputChange}
                  placeholder="Enter password"
                  type="password"
                  name="password"
                  mode="md"
                  // labelPlacement="floating"
                />
              </div>
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
                <p className="font-bold">Sign In</p>
              </IonButton>
              {error && <p>{error}</p>}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="text-sm text-center flex px-8 py-6 my-1 opacity-50">
                <div className="w-full h-0.5 bg-white mt-2"></div>
                <p className="px-1">OR</p>
                <div className="w-full h-0.5 bg-white mt-2"></div>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                mode="ios"
                onClick={() => googleSignIn()}
                expand="block"
                fill="solid"
                color="danger"
                disabled={loading}
              >
                <IonIcon
                  className="pl-1"
                  slot="start"
                  icon={logoGoogle}
                ></IonIcon>

                <p className="font-bold w-full">Sign in with Google</p>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                mode="ios"
                color={'secondary'}
                expand="block"
                onClick={handleSignUp}
                disabled={loading}
              >
                <p className="font-bold">Sign up</p>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
