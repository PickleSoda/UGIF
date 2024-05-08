import {
  IonIcon,
  IonContent,
  IonModal,
  IonButton,
  useIonRouter,
  IonLabel,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonRadioGroup,
  IonRadio,
} from '@ionic/react';
import GifCard from '../ui/GifCard';
import { IGif } from '../../mock';
import { shareOutline, downloadOutline, copyOutline } from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
import { useState } from 'react';
import { request } from '../../lib/axios';
import Store from '../../store';
import { Browser } from '@capacitor/browser';
const handlePayment = async (selectedValue: number) => {
  try {
    const { data } = await request({
      url: '/payment/create_invoice',
      method: 'post',
      data: { amount: selectedValue },
    });
    console.log(data);
    console.log(data.link);
    await Browser.open({ url: data.link });
  } catch (e) {
    console.log(e);
    await Browser.open({
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
  }
};
const points = [
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
];

const PaymentModal = ({
  open,
  onDidDismiss,
}: {
  open: boolean;
  onDidDismiss: () => void;
}) => {
  const [selectedValue, setSelectedValue] = useState<number>(points[0].value);
  return (
    <IonModal
      isOpen={open}
      onDidDismiss={onDidDismiss}
      initialBreakpoint={0.75}
      breakpoints={[0.75]}
      handleBehavior="cycle"
    >
      <IonContent>
        <div className="ion-margin-top ion-margin-bottom">
          <IonRadioGroup
            onIonChange={ev => setSelectedValue(ev.detail.value)}
            value={selectedValue}
          >
            {points.map(point => (
              <IonItem
                key={point.value}
                style={{ backgroundColor: 'var(--ion-background-color, #fff)' }}
              >
                <IonRadio value={point.value}>{point.label}</IonRadio>
              </IonItem>
            ))}
          </IonRadioGroup>
        </div>
        <IonButton
          className="ion-padding"
          mode="ios"
          onClick={() => handlePayment(selectedValue)}
          expand="block"
        >
          Pay
        </IonButton>
      </IonContent>
    </IonModal>
  );
};
export default PaymentModal;
