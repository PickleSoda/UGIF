import React from 'react';
import { IonPage, IonContent, IonButton, useIonRouter } from '@ionic/react';

const Home = () => {
  const router = useIonRouter();
  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        scrollY={false}
        className="bg-image flex items-center justify-center"
      >
        <div className="content-container">
          <h1 className="title">Explore the StarSwap</h1>
          <p className="subtitle">
            Transform Your Moments by Seamlessly Swapping Faces in GIFs for
            Unforgettable Fun!
          </p>
          <div className="button-container">
            <IonButton
              expand="block"
              className="signin-button-home"
              onClick={handleSignIn}
            >
              Sign In
            </IonButton>
            <IonButton
              expand="block"
              className="create-account-button-home"
              onClick={handleSignUp}
            >
              Create Account
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
