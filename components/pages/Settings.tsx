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
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import PaymentModal from '../modals/PaymentModal';
import Store from '../../store';
import { userStore } from '../../store/userStore';
import useBalance from '../../hooks/useBalance';
import useAlerts from '../../hooks/useAlerts';
import { useState } from 'react'; // Import useState
const Settings = () => {
  const { showLogoutAlert } = useAlerts();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { fetchBalance } = useBalance();
  const handleRefresh = (event: CustomEvent) => {
    fetchBalance();
    setTimeout(() => {
      // Any calls to load data go here
      console.log('refresh');
      event.detail.complete();
    }, 1000);
  };
  const balance = userStore.useState(s => s.balance);

  const TopUpBalance = () => {
    setShowPaymentModal(true);
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
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
        <PaymentModal
          open={showPaymentModal}
          onDidDismiss={() => setShowPaymentModal(false)}
        ></PaymentModal>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
