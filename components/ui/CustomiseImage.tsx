import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { IonButton, IonIcon } from '@ionic/react';
import {
  addCircle,
  heartCircleOutline,
  radioButtonOnOutline,
  arrowUpCircleOutline,
} from 'ionicons/icons';
interface photo {
  photo: string | undefined;
  base64Photo: string | undefined;
}

interface CustomiseImageProps {
  onPhotoSelect: ((photo: photo) => void) | undefined;
  onTakePhoto: () => void;
  onOpenGallery: () => void;
};

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
const CustomiseImage = ({onPhotoSelect, onTakePhoto, onOpenGallery}:CustomiseImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
        className="absolute flex flex-col items-center justify-center -mt-40 z-10 "
        variants={{
          open: {
            clipPath: 'inset(0% 0% 0% 0% round 10px)',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.5,
              delayChildren: 0.3,
              staggerChildren: -0.1,
            },
          },
          closed: {
            clipPath: 'inset(10% 50% 90% 50% round 10px)',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.3,
              when: 'afterChildren',
              staggerDirection: 1,
              staggerChildren: -0.06,
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
            onClick={() => onOpenGallery()}
          >
            <IonIcon
              className="h-10 w-10 -ml-6"
              icon={arrowUpCircleOutline}
              slot="start"
            ></IonIcon>
           choose from gallery
          </IonButton>
        </motion.li>
        <motion.li variants={itemVariants}>
          <IonButton
            shape="round"
            mode="ios"
            size="small"
            className="customise-button-small"
            onClick={() => onTakePhoto()}
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
    </motion.div>
  );
};

export default CustomiseImage;
