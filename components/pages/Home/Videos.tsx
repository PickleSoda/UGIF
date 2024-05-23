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
import Store from '../../../store';
import CategorySegment from '../../ui/CategorySegment';

const Videos = () => {
  const { handleCategotyChange, videos, handleRefresh, fetchGifs } =
    useVideos();
  const videoCategories = Store.useState(s => [
    {
      id: '',
      name: 'All',
      category: 'video',
    },
    ...s.categories.filter(category => category.category === 'video'),
  ]);
  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');

  const openDetails = (id: string) => {
    setShowGifDetail(true);
    setSelectedGif(id);
  };

  return (
    <>
      <CategorySegment
        categories={videoCategories}
        onSegmentChange={handleCategotyChange}
      />
      <VideoDetailModal
        open={showGifDetail}
        onDidDismiss={() => setShowGifDetail(false)}
        id={selectedGif}
      />
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      {videos.length === 0 ? (
        <div className="absolute h-full top-1/2 left-1/2 -translate-x-1/2 text-xl">
          No videos found
        </div>
      ) : (
        videos.map((item, index) => (
          <div key={index} className="px-6">
            <video controls>
              <source src={item.src} type="video/mp4" />
            </video>
            <div className="mb-4 flex justify-center">
              <IonButton onClick={() => openDetails(item.id)}>
                <IonLabel>Generate Video</IonLabel>
              </IonButton>
            </div>
          </div>
        ))
      )}
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
