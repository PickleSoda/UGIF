import {
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import useGifs from '../../../hooks/useGifs';
import React, { useState, useEffect } from 'react';
// import ResponsiveGrid, { GridItem } from '../../ui/ResponsiveGrid';
import Store from '../../../store';
import CategorySegment from '../../ui/Home/CategorySegment';
import ModalFrame from '../../ui/modals/ModalFrame';
import MasonryGrid from '../../ui/MasonryGrid';

const Gifs = () => {
  const { handleRefresh, fetchGifs, handleCategotyChange } = useGifs();
  const gifCategories = Store.useState(s => [
    {
      id: '',
      name: 'All',
      category: 'gif',
    },
    ...s.categories.filter(category => category.category === 'gif'),
  ]);
  const Gifs = Store.useState(s => s.gifs);
  const [showGifDetail, setShowGifDetail] = useState(false);
  const [selectedGif, setSelectedGif] = useState('');
  const [gifsLoaded, setgifsLoaded] = useState(false);

  const openGifDetails = (id: string) => {
    setShowGifDetail(true);
    setSelectedGif(id);
  };
  const handleSegmentChange = (category: string) => {
    handleCategotyChange(category);
    setgifsLoaded(false);
  };
  useEffect(() => {
    Gifs.length == 0
      ? fetchGifs(() => setTimeout(() => setgifsLoaded(true), 500))
      : setgifsLoaded(true);
  }, [Gifs, fetchGifs]);

  return (
    <>
      <IonRefresher slot='fixed' pullMin={600} onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <CategorySegment
        categories={gifCategories}
        onSegmentChange={handleSegmentChange}
      />
      {Gifs.length === 0 ? (
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
        <MasonryGrid rows={Gifs} fetchMore={(func) => fetchGifs(func)} hasNextPage ImageClick={(id) => openGifDetails(id)} cols={2} />
      )}

      <ModalFrame
        open={showGifDetail}
        onDidDismiss={() => setShowGifDetail(false)}
        id={selectedGif}
        type="gif"
      />
    </>
  );
};

export default Gifs;
