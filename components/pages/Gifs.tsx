import {
  IonPage,
  IonHeader,
  IonContent,
  IonSearchbar,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from '@ionic/react';
import { Virtuoso } from 'react-virtuoso';
import { useState } from 'react';
import GifDetailModal from '../modals/GifDetailModal';
import GifCard from '../ui/GifCard';
import useGifs from '../../hooks/useGifs';
const Gifs = () => {
  const { handleInput, homeItems, handleRefresh, fetchGifs } = useGifs();
  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');

  const openGifDetails = (id: string) => {
    setShowGifDetail(true);
    setSelectedGif(id);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pb-2">
          <IonSearchbar
            debounce={1000}
            onIonInput={ev => handleInput(ev)}
            className="custom-searchbar mt-3 "
            showCancelButton="focus"
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <GifDetailModal
          open={showGifDetail}
          onDidDismiss={() => setShowGifDetail(false)}
          id={selectedGif}
        />
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <Virtuoso
          className="ion-content-scroll-host"
          data={homeItems}
          itemContent={(index, Item) => (
            <div onClick={() => openGifDetails(Item.id)} key={index}>
              <GifCard {...Item} />
            </div>
          )}
          components={{
            Footer: () => (
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
            ),
          }}
        />
      </IonContent>
    </IonPage>
  );
};
export default Gifs;
