import {
  IonContent,
  IonModal,
  IonButton,
  IonItem,
  IonRadioGroup,
  IonRadio,
  useIonLoading,
} from '@ionic/react';
import { useState } from 'react';
import { request } from '../../lib/axios';
import { Browser } from '@capacitor/browser';
import { points } from '../../mock';

const PaymentModal = ({
  open,
  onDidDismiss,
}: {
  open: boolean;
  onDidDismiss: () => void;
}) => {
  const [present, dismiss] = useIonLoading();
  const handlePayment = async (selectedValue: number) => {
    try {
      const { data } = await request({
        url: '/payment/create_invoice',
        method: 'post',
        data: { amount: selectedValue },
      });
      present({
        message: 'Redirecting to payment gateway...',
        duration: 10000,
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
    finally {
      dismiss();
    }
  };

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
