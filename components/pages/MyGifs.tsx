
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonList,
  IonItem,
} from '@ionic/react';
import { Virtuoso } from 'react-virtuoso';
import Notifications from './Notifications';
import { useState, useEffect } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import GifCard from '../ui/GifCard';
import { userStore } from '../../store/userStore';
import NanCard from '../ui/NanCard';
import Store from '../../store';
const MyGifs = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const gifs = userStore.useState(s => s.gifs);
  const tasks = Store.useState(s => s.tasks);
  console.log('MyGifs', gifs || []);

  // useEffect(() => {
  //   const loadPhotos = async () => {
  //     if (!photos) {
  //       await loadSaved();
  //       console.log('photos', photos);
  //     }
  //   };

  //   loadPhotos();
  //   console.log('photos', photos);
  // }, [loadSaved, photos]);

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
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <Notifications
          open={showNotifications}
          onDidDismiss={() => setShowNotifications(false)}
        />
        {
          tasks.map((task, index) => (
            <NanCard key={index} spinner
            />
          ))
        }
        <Virtuoso className="ion-content-scroll-host" style={{ height: '100%' }}
          data={gifs || []}
          itemContent={(index, gif) =>
            <GifCard
              key={index}
              src={gif.src}
            />
          }
        />

      </IonContent>
    </IonPage>
  );
};
export default MyGifs;
