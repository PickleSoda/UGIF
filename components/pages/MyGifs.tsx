
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
} from '@ionic/react';
import { Virtuoso } from 'react-virtuoso';
import Notifications from './Notifications';
import { useState, useEffect } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import GifCard from '../ui/GifCard';
import useGifs from '../../hooks/useGifs';
import Image from 'next/image';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
const MyGifs = () => {

  const [showNotifications, setShowNotifications] = useState(false);
  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');
  const { loadSaved, photos } = usePhotoGallery();

  const openGifDetails = (id: string) => {
    setShowGifDetail(true);
  }

  useEffect(() => {
    const loadPhotos = async () => {
      if (!photos) {
        await loadSaved();
        console.log('photos', photos);
      }
    };

    loadPhotos();
    console.log('photos', photos);
  }, [loadSaved, photos]);

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
        <Virtuoso className="ion-content-scroll-host" style={{ height: '100%' }}
          data={photos}
          itemContent={(index, Item) =>
            <GifCard
              src={Item.webviewPath?Item.webviewPath:''}
            />
          }
        />

      </IonContent>
    </IonPage>
  );
};
const Footer = () => {
  const { fetchGifs } = useGifs();
  return (
    <IonInfiniteScroll onIonInfinite={
      (ev) => {
        console.log('yoi', ev);
        fetchGifs();
        setTimeout(() => ev.target.complete(), 500);
      }}>
      <IonInfiniteScrollContent loadingText="Please wait..." loadingSpinner="bubbles" ></IonInfiniteScrollContent>
    </IonInfiniteScroll>
  )
}
export default MyGifs;
