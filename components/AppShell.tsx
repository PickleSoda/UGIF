'use client';
import React, { useEffect, useState } from 'react';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import usePollTasks from '../hooks/usePollTasks';
import Tabs from './pages/Tabs';
import { initializeUserState, userStore } from '../store/userStore';
import { useStoreState } from 'pullstate';
import Auth from './pages/auth/Auth';

setupIonicReact({});
defineCustomElements(window);

const AppShell = () => {
  const [initialized, setInitialized] = useState(false);
  usePollTasks();
  const isAuthorized = useStoreState(userStore, state => state.isAuth);

  useEffect(() => {
    const init = async () => {
      await initializeUserState();
      setInitialized(true);
    };

    init();
  }, []);

  // Listen for system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', async status => {
      try {
        await StatusBar.setStyle({
          style: status.matches ? Style.Dark : Style.Light,
        });
      } catch { }
    });

  if (!initialized) {
    return <div>Loading...</div>; // Show loading indicator or a splash screen
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          {isAuthorized ? (
            <Route path="/" render={() => <Tabs />} />
          ) : (
            <Route path="/" render={() => <Auth />} />
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
