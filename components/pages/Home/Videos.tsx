import {
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonRefresher,
  IonRefresherContent,
  IonLabel,
  IonButton,
} from '@ionic/react';
import ModalFrame from '../../modals/ModalFrame';
import useVideos from '../../../hooks/useVideos';
import React, { forwardRef, useState } from 'react';
import Store from '../../../store';
import CategorySegment from '../../ui/CategorySegment';
import ResponsiveGrid, { GridItem } from '../../ui/ResponsiveGrid';
import { motion } from 'framer-motion';
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
      <ModalFrame
        open={showGifDetail}
        onDidDismiss={() => setShowGifDetail(false)}
        id={selectedGif}
        type="video"
      />
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      {videos.length === 0 ? (
        <div className="absolute h-full top-1/2 left-1/2 -translate-x-1/2 text-xl">
          No videos found
        </div>
      ) : (
        <ResponsiveGrid cols={1}>
          {videos.map((item, index) => (
            <GridItem key={index} ratio={item.ratio - 0.22}>
              <motion.div
                onClick={() => openDetails(item.id)}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-6"
              >
                <video controls className="w-full rounded-lg ">
                  <source
                    src={item.src}
                    type="video/mp4"
                    className="min-h-60"
                  />
                </video>
                <div className="mb-4 flex justify-center">
                  <IonButton>
                    <IonLabel>Generate Video</IonLabel>
                  </IonButton>
                </div>
              </motion.div>
            </GridItem>
          ))}
        </ResponsiveGrid>
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
