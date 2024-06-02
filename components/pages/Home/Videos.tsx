import {
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonRefresher,
  IonRefresherContent,
  IonLabel,
  IonButton,
} from '@ionic/react';
import ModalFrame from '../../ui/modals/ModalFrame';
import useVideos from '../../../hooks/useVideos';
import React, { useState, useEffect } from 'react';
import Store from '../../../store';
import CategorySegment from '../../ui/Home/CategorySegment';
import MasonryGrid from '../../ui/MasonryGrid';
const Videos = () => {
  const { handleCategotyChange, handleRefresh, fetchVideos } =
    useVideos();
  const videoCategories = Store.useState(s => [
    {
      id: '',
      name: 'All',
      category: 'video',
    },
    ...s.categories.filter(category => category.category === 'video'),
  ]);
  const [showVideoDetail, setShowVideoDetail] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');

  const openDetails = (id: string) => {
    setShowVideoDetail(true);
    setSelectedVideo(id);
  };
  const Videos = Store.useState(s => s.videos.map(video => {
    return {
      id: video.id,
      src: video.thumbnail,
      ratio: 1.78,
    };
  })
  );


  return (
    <>
      <IonRefresher slot='fixed' pullMin={600} onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <CategorySegment
        categories={videoCategories}
        onSegmentChange={handleCategotyChange}
      />
      <ModalFrame
        open={showVideoDetail}
        onDidDismiss={() => setShowVideoDetail(false)}
        id={selectedVideo}
        type="video"
      />

      {Videos.length === 0 ? (
        <div className="absolute h-full top-1/2 left-1/2 -translate-x-1/2 text-xl">
          No videos found
        </div>
      ) : (
          <MasonryGrid
            rows={Videos}
            ImageClick={openDetails}
            cols={1}
            fetchMore={fetchVideos}
            hasNextPage
          />
      )}
      <IonInfiniteScroll
        onIonInfinite={ev => {
          console.log('yoi', ev);
          fetchVideos();
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
