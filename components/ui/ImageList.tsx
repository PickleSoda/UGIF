import { IonImg, IonAvatar } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useEffect, useCallback } from 'react';
import MediaFab from '../ui/MediaFab';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
import { AnimatePresence, motion } from 'framer-motion';

type side = 'start' | 'end' | 'top' | 'bottom' | undefined;

type fab = side;
type ImageListProps = {
  fab?: fab;
  onPhotoSelect?: (photo: any) => void;
};

const ImageList = ({ fab = undefined, onPhotoSelect }: ImageListProps) => {
  const { loadSavedFolder, checkAndDeleteOldPhotos } = usePhotoGallery();
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const imageSelected = (photo: any) => {
    if (selectedPhoto?.filepath === photo.filepath) {
      setSelectedPhoto(null);
      if (onPhotoSelect) {
        onPhotoSelect(undefined);
      }
    } else {
      setSelectedPhoto(photo);
      if (onPhotoSelect) {
        onPhotoSelect({
          photo: photo.webviewPath,
          base64Photo: photo.base64Data,
        });
      }
    }
  };

  const fetchPhotos = useCallback(async () => {
    await checkAndDeleteOldPhotos();
    const photos = await loadSavedFolder('photos');
    console.log('photos', photos);
    setPhotos(photos.reverse());
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
        className="w-full mt-1.5"
        spaceBetween={50}
        slidesPerView={4.6}
        onSwiper={swiper => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <motion.div
              whileTap={{
                scale: 0.8,
                rotate: 10,
              }}
              onClick={() => !fab && imageSelected(photo)}
              className="w-11 h-11 flex justify-center items-center"
            >
              <IonAvatar
                className={`h-11 w-11 border-2 ${
                  selectedPhoto?.filepath === photo.filepath
                    ? ' border-blue-500'
                    : 'border-gray-700'
                }`}
              >
                <IonImg src={photo.webviewPath} />
              </IonAvatar>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageList;
