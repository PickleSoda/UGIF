
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
  IonList
} from '@ionic/react';
import Notifications from './Notifications';
import { useState, useEffect } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import GifDetailModal from './GifDetailModal';
import Store from '../../store';
import GifCard from '../ui/GifCard';
import axios from 'axios';
import { HomeItem } from '../../mock';
const Gifs = () => {
  const loadedGifs = Store.useState(s => s.homeItems);
  const [homeItems, setHomeItems] = useState<HomeItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');
  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const response = await axios.post('https://gifs.unclothed.com/gifs/fetch', { /* request body */ }); // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint and provide the request body as needed
        console.log(response.data); // Assuming the data you need is directly in the response body
        Store.update((s) => {
          s.homeItems = response.data.gifs;
        });
        setHomeItems(response.data.gifs);
      } catch (error) {
        console.error('Failed to fetch GIFs:', error);
      }
    };
    loadedGifs.length === 0 ? fetchGifs() : setHomeItems(loadedGifs);
  }, [loadedGifs]);
  const handleInput = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    homeItems && setHomeItems(loadedGifs.filter((d) => d.id.toLowerCase().indexOf(query) > -1));

  };

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

        <IonList>
          {homeItems ? homeItems.map((i, index) => (
            <div onClick={() => openGifDetails(i.id)} key={index} >
              <GifCard {...i} />
            </div>
          )) : <div>Loading...</div>}
        </IonList>


      </IonContent>
    </IonPage>
  );
};

export default Gifs;
