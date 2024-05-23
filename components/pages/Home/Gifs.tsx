import {
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import GifDetailModal from '../../modals/GifDetailModal';
import GifCard from '../../ui/GifCard';
import useGifs from '../../../hooks/useGifs';
import React, { useState, useEffect } from 'react';
import ResponsiveGrid from '../../ui/ResponsiveGrid';
import SpringModal from '../../modals/GifModal';
import Store from '../../../store';
import CategorySegment from '../../ui/CategorySegment';
import { motion } from 'framer-motion';
const GridItem: React.FC<{
  ratio: number;
  children: React.ReactElement<any>;
}> = ({ ratio, children }) => <div data-ratio={ratio}>{children}</div>;
const Gifs = () => {
  const { gifs, handleRefresh, fetchGifs, handleCategotyChange } = useGifs();
  const gifCategories = Store.useState(s => [
    {
      id: '',
      name: 'All',
      category: 'gif',
    },
    ...s.categories.filter(category => category.category === 'gif'),
  ]);
  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [gifsLoaded, setgifsLoaded] = useState(false);

  const openGifDetails = (id: string) => {
    setIsOpen(true);
    setSelectedGif(id);
  };
  const handleSegmentChange = (category: string) => {
    handleCategotyChange(category);

    setgifsLoaded(false);
  };
  useEffect(() => {
    gifs.length == 0
      ? fetchGifs(() => setTimeout(() => setgifsLoaded(true), 500))
      : setgifsLoaded(true);
  }, [gifs, fetchGifs]);

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <CategorySegment
        categories={gifCategories}
        onSegmentChange={handleSegmentChange}
      />
      <GifDetailModal
        open={showGifDetail}
        onDidDismiss={() => setShowGifDetail(false)}
        id={selectedGif}
      />
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} id={selectedGif} />
      {gifs.length === 0 ? (
        gifsLoaded ? (
          <div className="absolute h-full top-1/2 left-1/2 -translate-x-1/2 text-xl">
            No gifs found
          </div>
        ) : (
          <div className="absolute h-full top-1/2 left-1/2 -translate-x-1/2 text-xl">
            Loading...
          </div>
        )
      ) : (
        <ResponsiveGrid cols={2}>
          {gifs.map((item, index) => (
            <GridItem key={index} ratio={item.ratio}>
              <motion.div
                onClick={() => openGifDetails(item.id)}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <GifCard {...item} />
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
export default Gifs;
