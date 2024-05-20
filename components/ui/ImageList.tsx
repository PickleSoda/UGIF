import { IonImg, IonAvatar } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useEffect, useCallback } from 'react';
import MediaFab from '../ui/MediaFab';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';

type side = 'start' | 'end' | 'top' | 'bottom' | undefined;

type fab = side;
const Settings = ({ fab = undefined }: { fab: fab }) => {
  const { loadSavedFolder } = usePhotoGallery();
  const [photos, setPhotos] = useState<any[]>([]);

  const fetchPhotos = useCallback(async () => {
    const photos = await loadSavedFolder('photos');
    console.log('photos', photos);
    setPhotos(photos);
  }, [loadSavedFolder, setPhotos]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <div className="w-full flex">
      {fab && (
        <div className="w-20 h-14 z-50">
          <MediaFab side={fab} photoTaken={() => fetchPhotos()} />
        </div>
      )}
      <Swiper
        className="w-full mt-2"
        spaceBetween={50}
        slidesPerView={4.6}
        onSwiper={swiper => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <IonAvatar className="h-10 w-10">
              <IonImg src={photo.webviewPath} />
            </IonAvatar>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default Settings;
