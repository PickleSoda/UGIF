import {
  IonPage,
  IonHeader,
  IonContent,
  IonSearchbar,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  RefresherEventDetail,
} from '@ionic/react';
import { Virtuoso } from 'react-virtuoso';
import { useState } from 'react';
import GifDetailModal from '../modals/GifDetailModal';
import GifCard from '../ui/GifCard';
import useGifs from '../../hooks/useGifs';
const Gifs = () => {
  const { handleInput, homeItems } = useGifs();
  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      // Any calls to load data go here
      event.detail.complete();
    }, 2000);
  }
  const openGifDetails = (id: string) => {
    setShowGifDetail(true);
    setSelectedGif(id);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonSearchbar
          debounce={1000}
          onIonInput={ev => handleInput(ev)}
          className="custom-searchbar p-4"
          showCancelButton="focus"
        ></IonSearchbar>
      </IonHeader>
      <IonContent fullscreen>
        <GifDetailModal
          open={showGifDetail}
          onDidDismiss={() => setShowGifDetail(false)}
          id={selectedGif}
        />
        {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher> */}
        <Virtuoso
          className="ion-content-scroll-host"
          style={{ height: '100%', overflow: 'auto', width: '100%' }}
          data={homeItems}
          itemContent={(index, Item) => (
            <div onClick={() => openGifDetails(Item.id)} key={index}>
              <GifCard {...Item} />
            </div>
          )}
          components={{ Footer }}
        />
      </IonContent>
    </IonPage>
  );
};
const Footer = () => {
  const { fetchGifs } = useGifs();
  return (
    <IonInfiniteScroll
      onIonInfinite={ev => {
        console.log('yoi', ev);
        fetchGifs();
        setTimeout(() => ev.target.complete(), 500);
      }}
    >
      <IonInfiniteScrollContent
        loadingText="Please wait..."
        loadingSpinner="bubbles"
      ></IonInfiniteScrollContent>
    </IonInfiniteScroll>
  );
};
export default Gifs;
