import {
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonRefresher,
  IonRefresherContent,
  IonLabel,
  IonButton,
} from '@ionic/react';
import VideoDetailModal from '../../modals/VideoDetailModal';
import useVideos from '../../../hooks/useVideos';
import React, { forwardRef, useState } from 'react';
import ResponsiveGrid from '../../ui/ResponsiveGrid';

const Videos = () => {
  const { handleInput, videos, handleRefresh, fetchGifs } = useVideos();

  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');

  const openDetails = (id: string) => {
    setShowGifDetail(true);
    setSelectedGif(id);
  };

  return (
    <>
      <VideoDetailModal
        open={showGifDetail}
        onDidDismiss={() => setShowGifDetail(false)}
        id={selectedGif}
      />
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      {videos.map((item, index) => (
        <div key={index}>
          <video controls>
            <source src={item.src} type="video/mp4" />
          </video>
          <IonButton onClick={() => openDetails(item.id)}>
            <IonLabel>Generate Video</IonLabel>
          </IonButton>
        </div>
      ))}
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
export default Videos;
