import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
} from '@ionic/react';
import { Virtuoso } from 'react-virtuoso';
import Notifications from './Notifications';
import { useState, useEffect } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import GifCard from '../ui/GifCard';
import { userStore } from '../../store/userStore';
import NanCard from '../ui/NanCard';
const MyGifs = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const gifs = userStore.useState(s => s.gifs);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Virtuoso
          className="ion-content-scroll-host"
          style={{ height: '100%' }}
          data={[...gifs].reverse() || []}
          itemContent={(index, gif) => {
            switch (gif.status) {
              case 'completed':
                return <GifCard key={index} src={gif.src} />;
              case 'processing':
                return <NanCard spinner={true} key={index} />;
              case 'failed':
                return <NanCard key={index} spinner={false} />;
              default:
                return null;
            }
          }}
        />
      </IonContent>
    </IonPage>
  );
};
export default MyGifs;
