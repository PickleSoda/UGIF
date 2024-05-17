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
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import GifDetailModal from '../modals/GifDetailModal';
import GifCard from '../ui/GifCard';
import useGifs from '../../hooks/useGifs';
import React, { forwardRef, useState } from 'react';
import ResponsiveGrid from '../ui/ResponsiveGrid';

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
      <IonContent>
        <GifDetailModal
          open={showGifDetail}
          onDidDismiss={() => setShowGifDetail(false)}
          id={selectedGif}
        />
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="my-4 p-1">
          <IonSegment mode="ios" value="GIF">
            <IonSegmentButton mode="ios" value="GIF">
              <IonLabel>GIF</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton mode="ios" value="video">
              <IonLabel>Video</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
        <ResponsiveGrid>
          {homeItems.map((item, index) => (
            <div key={index} onClick={() => openGifDetails(item.id)}>
              <GifCard {...item} />
            </div>
          ))}
        </ResponsiveGrid>
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
      </IonContent>
    </IonPage>
  );
};
export default Gifs;
