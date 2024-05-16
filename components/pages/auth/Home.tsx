import React from 'react';
import { IonPage, IonContent, IonButton, useIonRouter } from '@ionic/react';

const Home = () => {
  const router = useIonRouter();

  const welcome_svg = (<svg width="316" height="274" viewBox="0 0 316 274" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M196.797 69.0142C198.253 63.579 205.965 63.579 207.422 69.0142L208.172 71.8126C218.965 112.089 250.46 143.526 290.756 154.244L293.683 155.022C299.131 156.471 299.131 164.203 293.683 165.652L290.756 166.431C250.46 177.149 218.965 208.586 208.172 248.862L207.422 251.66C205.965 257.095 198.253 257.095 196.797 251.66L196.047 248.862C185.254 208.586 153.759 177.149 113.463 166.431L110.536 165.652C105.088 164.203 105.088 156.471 110.536 155.022L113.463 154.244C153.759 143.526 185.254 112.089 196.047 71.8126L196.797 69.0142Z" fill="#F1F3F4" stroke="black"/>
  <path d="M128.865 21.7566C130.321 16.3215 138.033 16.3214 139.49 21.7566L140.15 24.2223C150.943 64.4984 182.439 95.9351 222.735 106.653L225.328 107.343C230.776 108.792 230.777 116.524 225.328 117.973L222.735 118.663C182.439 129.381 150.943 160.818 140.15 201.094L139.49 203.559C138.033 208.995 130.321 208.995 128.865 203.559L128.204 201.094C117.411 160.818 85.9155 129.381 45.6194 118.663L43.026 117.973C37.5777 116.524 37.5777 108.792 43.026 107.343L45.6194 106.653C85.9155 95.9351 117.411 64.4984 128.204 24.2224L128.865 21.7566Z" stroke="black"/>
  <path d="M222.265 18.2087C222.433 16.5698 224.824 16.5698 224.992 18.2087C225.783 25.9325 231.9 32.0471 239.627 32.8197C241.265 32.9835 241.265 35.3708 239.627 35.5346C231.9 36.3072 225.783 42.4218 224.992 50.1456C224.824 51.7845 222.433 51.7844 222.265 50.1456C221.473 42.4218 215.356 36.3072 207.629 35.5346C205.991 35.3708 205.991 32.9835 207.629 32.8197C215.356 32.0471 221.473 25.9325 222.265 18.2087Z" fill="#F1F3F4" stroke="black"/>
  <path d="M20.4627 67.5467C20.5413 66.786 21.6527 66.786 21.7313 67.5467C22.2249 72.3258 26.0138 76.1123 30.7965 76.5868C31.5552 76.6621 31.5552 77.768 30.7965 77.8433C26.0138 78.3177 22.2249 82.1043 21.7313 86.8834C21.6527 87.644 20.5413 87.644 20.4627 86.8834C19.9691 82.1043 16.1802 78.3177 11.3975 77.8433C10.6388 77.768 10.6388 76.6621 11.3975 76.5868C16.1802 76.1123 19.9691 72.3258 20.4627 67.5467Z" fill="#F1F3F4" stroke="black"/>
  </svg>
  )

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };


  return (
    <IonPage>
      <IonContent fullscreen scrollY={false} className="bg-white flex items-center justify-center">
        <div className="content-container">
          <div className="welcome-svg">
            {welcome_svg}
          </div>
          <h1 className="title">Explore the StarSwap</h1>
          <p className="subtitle">Transform Your Moments by Seamlessly Swapping Faces in GIFs for Unforgettable Fun!</p>
          <div className="button-container">
            <IonButton expand="block" className="signin-button-home" onClick={handleSignIn}>
              Sign In
            </IonButton>
            <IonButton expand="block" className="create-account-button-home" onClick={handleSignUp}>
              Create Account
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;