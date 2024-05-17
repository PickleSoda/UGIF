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
import GifDetailModal from '../../modals/GifDetailModal';
import GifCard from '../../ui/GifCard';
import useGifs from '../../../hooks/useGifs';
import React, { forwardRef, useState } from 'react';
import ResponsiveGrid from '../../ui/ResponsiveGrid';

const Gifs = () => {
  const { handleInput, gifs, handleRefresh, fetchGifs } = useGifs();

  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');

  const openGifDetails = (id: string) => {
    setShowGifDetail(true);
    setSelectedGif(id);
  };

  return (
    <>
      <GifDetailModal
        open={showGifDetail}
        onDidDismiss={() => setShowGifDetail(false)}
        id={selectedGif}
      />
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <ResponsiveGrid>
        {gifs.map((item, index) => (
          <div key={index} onClick={() => openGifDetails(item.id)}>
            <GifCard key={index} {...item} />
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
    </>
  );
};
export default Gifs;
