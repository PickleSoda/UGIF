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
import SpringModal from '../../modals/GifModal';
const Gifs = () => {
  const { handleInput, gifs, handleRefresh, fetchGifs } = useGifs();

  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const openGifDetails = (id: string) => {
    setIsOpen(true);
    setSelectedGif(id);
  };

  return (
    <>
      <GifDetailModal
        open={showGifDetail}
        onDidDismiss={() => setShowGifDetail(false)}
        id={selectedGif}
      />
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} id={selectedGif} />
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
const ExampleWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
      >
        Open Modal
      </button>
    </div>
  );
};
export default Gifs;
