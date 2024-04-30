
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
  IonSearchbar,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
} from '@ionic/react';
import { Virtuoso } from 'react-virtuoso';
import Notifications from './Notifications';
import { useState, } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import GifDetailModal from './GifDetailModal';
import GifCard from '../ui/GifCard';
import useGifs from '../../hooks/useGifs';
const Gifs = () => {
  const { handleInput, homeItems } = useGifs();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');


  const openGifDetails = (id: string) => {
    setShowGifDetail(true);
    setSelectedGif(id);
  }

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
          <IonSearchbar debounce={1000} onIonInput={(ev) => handleInput(ev)} className='p-0'></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <Notifications
          open={showNotifications}
          onDidDismiss={() => setShowNotifications(false)}
        />
        <GifDetailModal open={showGifDetail} onDidDismiss={() => setShowGifDetail(false)} id={selectedGif} />
        <Virtuoso className="ion-content-scroll-host" style={{ height: '100%' }}
          data={homeItems}
          itemContent={(index, Item) =>
            <div onClick={() => openGifDetails(Item.id)} key={index} >
              <GifCard {...Item} />
            </div>}
          components={{ Footer }}
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
export default Gifs;
