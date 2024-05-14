import React, { useState } from 'react';
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
import { request } from '../../../lib/axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();

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
      router.push('/login', 'forward', 'replace'); // Redirect to login on successful sign-up
    } catch (err:any) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/signin', 'none', 'push');
  };

  return (
    <IonPage >
      <IonContent scroll-y={false} fullscreen>
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
              <div className="bg-gray-100 text-black shadow-inner py-1 px-10 rounded-full">
                <IonInput
                  value={formData.username}
                  onIonChange={handleInputChange}
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
              <div className="bg-gray-100 text-black shadow-inner py-1 px-10 rounded-full">
                <IonInput
                  value={formData.email}
                  onIonChange={handleInputChange}
                  placeholder="Enter email"
                  type="email"
                  name="email"
                  mode="md"
                ></IonInput>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="bg-gray-100 text-black shadow-inner py-1 px-10 rounded-full">
                <IonInput
                  value={formData.password}
                  onIonChange={handleInputChange}
                  placeholder="Enter password"
                  type="password"
                  name="password"
                  mode="md"
                ></IonInput>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="bg-gray-100 text-black shadow-inner py-1 px-10 rounded-full">
                <IonInput
                  value={formData.confirmPassword}
                  onIonChange={handleInputChange}
                  placeholder="Confirm password"
                  type="password"
                  name="confirmPassword"
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
              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
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
                color="secondary"
                expand="block"
                onClick={handleSignIn}
              >
                <p className="font-bold">Sign in</p>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
