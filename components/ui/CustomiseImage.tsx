import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { IonButton, IonIcon } from '@ionic/react';
import {
  addCircle,
  heartCircleOutline,
  radioButtonOnOutline,
} from 'ionicons/icons';
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
const CustomiseImage = ({
  onPhotoSelect,
}: {
  onPhotoSelect?: (photo: CustomiseImageProps) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { takePhoto, getPhotoAsBase64 } = usePhotoGallery();
  const [base64Photo, setBase64Photo] = useState<string | undefined>(undefined);
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const handleTakePhoto = async () => {
    setIsGalleryOpen(false);
    setIsOpen(false);
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
      onPhotoSelect && onPhotoSelect({ photo: undefined, base64Photo: undefined });
      return;
    }
    setPhoto(photo.webviewPath);
    const base64data = await getPhotoAsBase64(photo?.webviewPath);
    console.log('photo selected', photo, base64data);
    onPhotoSelect &&
      onPhotoSelect({ photo: photo.webviewPath, base64Photo: base64data });
  };

  const openGalery = () => {
    setIsOpen(false);
    setIsGalleryOpen(true);
  };
  return (
    <motion.div
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className="flex flex-col items-center justify-center w-full h-full "
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IonButton shape="round" mode="ios">
          <IonIcon
            className="h-10 w-10 -ml-4"
            icon={addCircle}
            slot="start"
          ></IonIcon>
          Customise
        </IonButton>
      </motion.button>
      <motion.ul
        className="absolute flex flex-col items-center justify-center mt-28 z-10 "
        variants={{
          open: {
            clipPath: 'inset(0% 0% 0% 0% round 10px)',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.5,
              delayChildren: 0.3,
              staggerChildren: 0.1,
            },
          },
          closed: {
            clipPath: 'inset(10% 50% 90% 50% round 10px)',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.3,
              when: 'afterChildren',
              staggerDirection: -1,
              staggerChildren: 0.06,
            },
          },
        }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <motion.li variants={itemVariants}>
          <IonButton
            shape="round"
            mode="ios"
            size="small"
            className="customise-button-small"
            onClick={() => openGalery()}
          >
            <IonIcon
              className="h-10 w-10 -ml-6"
              icon={heartCircleOutline}
              slot="start"
            ></IonIcon>
            Swap materials
          </IonButton>
        </motion.li>
        <motion.li variants={itemVariants}>
          <IonButton
            shape="round"
            mode="ios"
            size="small"
            className="customise-button-small"
            onClick={() => handleTakePhoto()}
          >
            <IonIcon
              className="h-10 w-10 -ml-6"
              icon={radioButtonOnOutline}
              slot="start"
            ></IonIcon>
            Take Photo
          </IonButton>
        </motion.li>
      </motion.ul>
      <motion.div initial={false} animate={isGalleryOpen ? 'open' : 'closed'}>
        <motion.div variants={itemVariants} className="w-full max-w-72">
          <ImageList onPhotoSelect={selectPhoto}></ImageList>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CustomiseImage;
