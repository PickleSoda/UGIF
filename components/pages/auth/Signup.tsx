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
import { request } from "../../../lib/axios";

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
      const response = await
        request({
          url: "/auth/register",
          method: "post",
          data: {
            username: username,
            email: email,
            password: password,
          }
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

  return (
    <IonPage>
      <IonContent className="char-bg content-div">
        <IonGrid>
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
                  value={email || ''}
                  onIonChange={e => setEmail(e.detail.value || '')}
                  placeholder="Enter email"
                  type="email"
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
              <IonItem>
                <IonInput
                  value={confirmPassword || ''}
                  onIonChange={e => setConfirmPassword(e.detail.value || '')}
                  placeholder="Confirm password"
                  type="password"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={handleSignUp} disabled={loading}>
                Sign Up
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
