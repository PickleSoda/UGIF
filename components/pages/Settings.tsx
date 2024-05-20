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
  IonAvatar,
  IonButton,
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
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
  const username = userStore.useState(s => s.username);

  const TopUpBalance = () => {
    setShowPaymentModal(true);
    console.log('yoi');
  };
  const handleLogout = () => {
    showLogoutAlert();
  };
  return (
    <IonPage className=' font-extrabold'>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className='profile-card'>
          <IonAvatar className='h-20 w-20'>
            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </IonAvatar>
          <p className="text-xl pt-1">{username}</p>
        </div>
        <div className='container p-6 space-y-3'>

          <div className="settings-card">
            <div className='flex flex-between justify-between'>
              <p className="text-bae font-semibold my-auto px-4" >
                Credits: <span className="px-1 font-bold"> {balance} </span>
              </p>
              <IonButton
                mode='ios'
                shape='round'
                size='small'
                onClick={() => TopUpBalance()}
              >
                <p className='font-bold text-base'>
                  Buy
                </p>
              </IonButton>
            </div>
          </div>
          <div className="settings-card">
            <p className="text-bae font-semibold my-auto px-4">
              Swap materials
            </p>
            <div className='w-full'>
              <Swiper
              className='w-full'
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
              >
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
              </Swiper>
            </div>
          </div>
          <IonList lines="full">
            <IonItem onClick={() => handleLogout()}>
              <h5>Logout</h5>
              <IonRippleEffect></IonRippleEffect>
            </IonItem>
            <IonItem>
              <h5>Terms and Conditions</h5>
              <IonRippleEffect></IonRippleEffect>
            </IonItem>
          </IonList>
        </div>

        <PaymentModal
          open={showPaymentModal}
          onDidDismiss={() => setShowPaymentModal(false)}
        ></PaymentModal>
      </IonContent>
    </IonPage>
  );
};
export default Settings;
