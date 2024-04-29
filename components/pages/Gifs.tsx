
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
  IonSearchbar
} from '@ionic/react';
import Notifications from './Notifications';
import { useState, useEffect } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { selectHomeItems } from '../../store/selectors';
import Store from '../../store';
import GifCard from '../ui/GifCard';
import axios from 'axios';
const Gifs = () => {
  const homeItems = Store.useState(selectHomeItems);
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const response = await axios.post('https://gifs.unclothed.com/gifs/fetch', { /* request body */ }); // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint and provide the request body as needed
        console.log(response.data); // Assuming the data you need is directly in the response body
        Store.update((s) => {
          s.homeItems = response.data.gifs;
        });
      } catch (error) {
        console.error('Failed to fetch GIFs:', error);
      }
    };


    fetchGifs();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonSearchbar ></IonSearchbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <Notifications
          open={showNotifications}
          onDidDismiss={() => setShowNotifications(false)}
        />
        {homeItems && homeItems.map((i, index) => (
          <GifCard {...i} key={index} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Gifs;
