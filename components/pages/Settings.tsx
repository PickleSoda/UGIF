import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonToggle,
  IonButton,
  useIonAlert,
} from '@ionic/react';

import Store from '../../store';
import { logoutUser } from '../../store/actions';
import { userStore } from '../../store/userStore';

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
      header: 'Buy Credits',
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
            <h3>
              BALANCE: <span className="text-blue-600">{balance}</span>
            </h3>
          </IonItem>
          <IonItem onClick={() => TopUpBalance()}>
            <h3>Top Up</h3>
          </IonItem>
          <IonItem onClick={() => handleLogout()}>
            <h3>Logout</h3>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
