import {
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import GifDetailModal from '../../modals/GifDetailModal';
import GifCard from '../../ui/GifCard';
import useGifs from '../../../hooks/useGifs';
import React, { useState } from 'react';
import ResponsiveGrid from '../../ui/ResponsiveGrid';
import SpringModal from '../../modals/GifModal';
import Store from '../../../store';
import CategorySegment from '../../ui/CategorySegment';
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

  const openGifDetails = (id: string) => {
    setIsOpen(true);
    setSelectedGif(id);
  };

  return (
    <>
      <CategorySegment
        categories={gifCategories}
        onSegmentChange={handleCategotyChange}
      />
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
        {
          gifs.length === 0 ? <div className='absolute h-full top-1/2 left-1/2 -translate-x-1/2 text-xl'>No gifs found</div> :
            gifs.map((item, index) => (
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
