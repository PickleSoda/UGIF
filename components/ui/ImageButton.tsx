import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { IonButton, IonIcon, IonAvatar, IonImg } from '@ionic/react';
import { addCircle } from 'ionicons/icons';
import ImageList from './ImageList';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
interface CustomiseImageProps {
  photo: string | undefined;
  base64Photo: string | undefined;
}

const itemVariants: Variants = {
  open: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    scale: 0.3,
    filter: 'blur(20px)',
    transition: { duration: 0.2 },
  },
};
const ImageButton = ({
  onPhotoSelect,
  onGenerateContent,
}: {
  onPhotoSelect?: (photo: CustomiseImageProps) => void;
  onGenerateContent?: () => void;
}) => {
  const [IsPhotoFromCamera, setIsPhotoFromCamera] = useState(false);
  const { takePhoto, getPhotoAsBase64 } = usePhotoGallery();
  const [base64Photo, setBase64Photo] = useState<string | undefined>(undefined);
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const handleTakePhoto = async () => {
    setIsPhotoFromCamera(true);
    try {
      const photoData = await takePhoto();
      console.log('Photo taken:', photoData);
      if (!photoData) return;
      setPhoto(photoData.photo.webPath);
      setBase64Photo(photoData.base64Data);
      onPhotoSelect &&
        onPhotoSelect({
          photo: photoData.photo.webPath,
          base64Photo: photoData.base64Data,
        });
    } catch (error) {
      console.error('Error taking photo:', error);
    }
    console.log('requesting generation', base64Photo);
  };

  const selectPhoto = async (photo: any) => {
    if (!photo) {
      console.log('no photo selected');
      setPhoto(undefined);
      onPhotoSelect &&
        onPhotoSelect({ photo: undefined, base64Photo: undefined });
      return;
    }
    setIsPhotoFromCamera(false);
    setPhoto(photo.webviewPath);
    const base64data = await getPhotoAsBase64(photo?.webviewPath);
    console.log('photo selected', photo, base64data);
    onPhotoSelect &&
      onPhotoSelect({ photo: photo.webviewPath, base64Photo: base64data });
  };

  const handleGeneration = () => {
    onGenerateContent && onGenerateContent();
  };
  const diselectCameraPhoto = () => {
    setIsPhotoFromCamera(false);
    setPhoto(undefined);
    setBase64Photo(undefined);
    onPhotoSelect &&
      onPhotoSelect({ photo: undefined, base64Photo: undefined });
  }
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
    >
      <div className="w-full max-w-72 flex mb-2">
        {
          IsPhotoFromCamera &&
          <motion.div

            whileTap={{
              scale: 0.8,
              rotate: 10,
            }}
            onClick={() => diselectCameraPhoto()}
            className="w-11 h-11 flex justify-center items-center mt-1.5 mr-1"
          >
            <IonAvatar
              className={`h-11 w-11 border-2 ${photo === photo
                  ? ' border-blue-500'
                  : 'border-gray-700'
                }`}
            >
              <IonImg src={photo} />
            </IonAvatar>
          </motion.div>
        }
        <ImageList onPhotoSelect={selectPhoto}></ImageList>
      </div>
      <motion.button whileTap={{ scale: 0.97 }}>
        {!photo ? (
          <IonButton shape="round" mode="ios" onClick={() => handleTakePhoto()}>
            <IonIcon
              className="h-10 w-10 -ml-4"
              icon={addCircle}
              slot="start"
            ></IonIcon>
            Take Photo
          </IonButton>
        ) : (
          <IonButton
            shape="round"
            mode="ios"
            onClick={() => handleGeneration()}
          >
            <IonIcon
              className="h-10 w-10 -ml-4"
              icon={addCircle}
              slot="start"
            ></IonIcon>
            Generate
          </IonButton>
        )}
      </motion.button>
    </div>
  );
};

export default ImageButton;
