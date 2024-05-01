import React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';

import Signup from './Signup';
import SingIn from './Signin';

const Intro = () => {
  return (
    <IonRouterOutlet>
      <Route path="" render={() => <Redirect to="/signin" />} exact={true} />
      <Route path="/signup" render={() => <Signup />} exact={true} />
      <Route path="/signin" render={() => <SingIn />} exact={true} />
    </IonRouterOutlet>
  );
};

export default Intro;
