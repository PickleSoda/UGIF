import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonRippleEffect,
  useIonAlert,
} from '@ionic/react';

import Store from '../../store';
import { logoutUser } from '../../store/actions';
import { userStore } from '../../store/userStore';
import NanCard from '../ui/NanCard';
const Settings = () => {
  const [presentAlert] = useIonAlert();
  const alert = useIonAlert();
  const settings = Store.useState(s => s.settings);
  const balance = userStore.useState(s => s.balance);
  const TopUpBalance = () => {
    presentAlert({
      header: 'Buy Credits',
      buttons: [
        {
          text: 'Exit',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
        {
          text: 'Buy',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ],
    });
    console.log('yoi');
  };
  const handleLogout = () => {
    presentAlert({
      header: 'Log Out',
      buttons: [
        {
          text: 'Cancel',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
        {
          text: 'Log Out',
          htmlAttributes: {
            'aria-label': 'logout',
          },
          handler: () => {
            logoutUser();
          },
        },
      ],
    });
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <h4>
              BALANCE: <span className="text-blue-600">{balance}</span>
            </h4>
            <IonRippleEffect></IonRippleEffect>
          </IonItem>
          <IonItem onClick={() => TopUpBalance()}>
            <h4>Top Up</h4>
            <IonRippleEffect></IonRippleEffect>
          </IonItem>
          <IonItem onClick={() => handleLogout()}>
            <h4>Logout</h4>
            <IonRippleEffect></IonRippleEffect>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
