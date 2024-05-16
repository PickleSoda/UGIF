import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonRippleEffect,
  IonRefresher,
  IonRefresherContent,
  IonThumbnail,
  IonIcon,
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import PaymentModal from '../modals/PaymentModal';
import { userStore } from '../../store/userStore';
import useBalance from '../../hooks/useBalance';
import useAlerts from '../../hooks/useAlerts';
import { useState } from 'react';

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
        <IonList lines="full">
          <IonItem>
            <IonThumbnail slot="start">
              <IonIcon
                className="w-14 h-14 opacity-45"
                icon={personCircleOutline}
              />
            </IonThumbnail>
            <div className="flex flex-col py-4 opacity-90">
              <p>User: {userStore.useState(s => s.username)}</p>
              <p>
                Credits: <span className="px-1 text-blue-600"> {balance} </span>
              </p>
            </div>
          </IonItem>
          <IonItem onClick={() => TopUpBalance()}>
            <h5>Buy Credits</h5>
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
