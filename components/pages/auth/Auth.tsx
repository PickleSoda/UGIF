import React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import Signup from './Signup';
import SingIn from './Signin';

const Intro = () => {
  GoogleAuth.initialize({
    clientId:
      '929769570343-o9f1b8bukao98ft2ios2037s8n5qd5s4.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });
  return (
    <IonRouterOutlet>
      <Route path="" render={() => <Redirect to="/signin" />} exact={true} />
      <Route path="/signup" render={() => <Signup />} exact={true} />
      <Route path="/signin" render={() => <SingIn />} exact={true} />
    </IonRouterOutlet>
  );
};

export default Intro;
