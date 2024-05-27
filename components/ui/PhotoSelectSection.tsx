import { useState, useCallback, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { IonButton, IonIcon, IonAvatar, IonImg } from '@ionic/react';
import { addCircle, flash, flashOutline } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import CustomiseImageCircles from './CustomiseImageCircles';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
interface PhotoProps {
    photo: string | undefined;
    base64Photo: string | undefined;
}
interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}
const PhotoSelectSection = ({
    onPhotoSelect,
    onGenerateContent,
}: {
    onPhotoSelect?: (photo: PhotoProps) => void;
    onGenerateContent?: () => void;
}) => {
    const { takePhoto, savePicture, loadSavedFolder, getPhotoAsBase64,pickPhotosFromGallery } = usePhotoGallery();
    const [photos, setPhotos] = useState<UserPhoto[]>([]);

    const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);


    const openCamera = async () => {
        try {
            const photo = await takePhoto();
            const saved = await savePicture(photo.photo);
            console.log('Photo saved:', saved);
            const image: UserPhoto = { webviewPath: saved.webviewPath, filepath: saved.filepath.replace(/^photos\//, '') };
            console.log('Photo taken:', image);
            setPhotos([image, ...photos]);
            imageSelected(image);
            // saveBase64AsFile(photo.base64Data, 'photo');
        } catch (error) {
            console.log(error);
        }
    };

    const handleGeneration = () => {
        onGenerateContent && onGenerateContent();
    };
    const imageSelected = async (photo: UserPhoto) => {
        if (selectedPhoto?.filepath === photo.filepath) {
            setSelectedPhoto(null);
            if (onPhotoSelect) {
                onPhotoSelect({ photo: undefined, base64Photo: undefined });
            }
        } else if (photo.webviewPath) {
            setSelectedPhoto(photo);
            const base64data = await getPhotoAsBase64(photo?.webviewPath);
            if (onPhotoSelect) {
                onPhotoSelect({ photo: photo.webviewPath, base64Photo: base64data });

            }
        }
    };
    const openGallery = async () => {
        try {
          const galleryResponse = await pickPhotosFromGallery();
          const galleryPhotos = galleryResponse.photos;
          console.log('Photos selected:', galleryPhotos);
          galleryPhotos.map(async (photo: any) => {
            const saved = await savePicture(photo);
            console.log('Photo saved:', saved);
            setPhotos([saved, ...photos]);
          });
        } catch (error) {
          console.log(error);
        }
      }
    const fetchPhotos = useCallback(async () => {
        const photos = await loadSavedFolder('photos');
        console.log('photos', photos);
        setPhotos(photos.reverse());
    }, [loadSavedFolder, setPhotos]);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full max-w-sm px-6 flex mb-2 overflow-hidden rounded-2xl bg-black/80 pb-2 pt-1 z-0">
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
                                onClick={() => imageSelected(photo)}
                                className="w-11 h-11 flex justify-center items-center"
                            >
                                <IonAvatar
                                    className={`h-11 w-11 border-2 ${selectedPhoto?.filepath === photo.filepath
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
            <div className='w-full flex flex-col items-center justify-center h-16'>
                {!selectedPhoto ? (
                    <CustomiseImageCircles onPhotoSelect={onPhotoSelect} onTakePhoto={openCamera} onOpenGallery={openGallery} />
                ) : (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <IonButton
                        shape="round"
                        mode="ios"
                        color={'light'}
                        onClick={() => handleGeneration()}
                    >
                        <IonIcon
                            className="h-8 w-10 -ml-4"
                            icon={flash}
                        ></IonIcon>
                        Generate
                    </IonButton>
                </motion.div>
                )}
            </div>
        </div>
    );
};

export default PhotoSelectSection;
