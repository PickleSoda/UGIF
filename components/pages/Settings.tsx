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

import { Browser } from '@capacitor/browser';
import Store from '../../store';
import { logoutUser } from '../../store/actions';
import { userStore } from '../../store/userStore';
import { request } from '../../lib/axios';
const Settings = () => {
  const [presentAlert] = useIonAlert();
  const alert = useIonAlert();
  const settings = Store.useState(s => s.settings);
  const balance = userStore.useState(s => s.balance);
  const handlePayment = async (selectedValue: string) => {
    try {
      const { data } = await request({
        url: '/payment/create_invoice',
        method: 'post',
        data: { amount: selectedValue },
      });
      console.log(data);
      data.status === 200 && (await Browser.open({ url: data.link }));
    } catch (e) {
      console.log(e);
      await Browser.open({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      });
    }
  };
  const TopUpBalance = () => {
    const alert = presentAlert({
      header: 'Buy Credits',
      subHeader: 'A Sub Header Is Optional',
      buttons: [
        {
          text: 'Close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
        {
          text: 'Buy',
          htmlAttributes: {
            'aria-label': 'close',
          },
          handler: async selectedValue => {
            handlePayment(selectedValue);
            console.log('Alert confirmed', selectedValue);
          },
        },
      ],
      inputs: [
        {
          label: '4.99 - 5 Credits',
          type: 'radio',
          value: 5,
        },
        {
          label: '14.99 - 20 Credits',
          type: 'radio',
          value: 20,
        },
        {
          label: '29.99 - 50 Credits',
          type: 'radio',
          value: 50,
        },
        {
          label: '49.99 - 100 Credits',
          type: 'radio',
          value: 100,
        },
        {
          label: '99.99 - 200 Credits',
          type: 'radio',
          value: 200,
        },
        {
          label: '399.99 - 1000 Credits',
          type: 'radio',
          value: 1000,
        },
        {
          label: '499.99 - 2500 Credits',
          type: 'radio',
          value: 2500,
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
