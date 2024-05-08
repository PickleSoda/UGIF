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
import useAlerts from '../../hooks/useAlerts';
const Settings = () => {
  const { showPaymentAlert, showLogoutAlert } = useAlerts();
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
    showPaymentAlert();
    console.log('yoi');
  };
  const handleLogout = () => {
    showLogoutAlert();
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle> Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <h5>
              Available Credits:{' '}
              <span className="px-1 text-blue-600"> {balance} </span>
            </h5>
            <IonRippleEffect></IonRippleEffect>
          </IonItem>
          <IonItem onClick={() => TopUpBalance()}>
            <h5>Top Up</h5>
            <IonRippleEffect></IonRippleEffect>
          </IonItem>
          <IonItem onClick={() => handleLogout()}>
            <h5>Logout</h5>
            <IonRippleEffect></IonRippleEffect>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
