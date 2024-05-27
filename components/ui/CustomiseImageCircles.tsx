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

const leftVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    x: -50,
    transition: { duration: 0.2 },
  },
};

const rightVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.2 },
  },
};

const CustomiseImageCircles = ({ onPhotoSelect, onTakePhoto, onOpenGallery }: CustomiseImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full h-14"
    >
      <motion.div      initial={false}
      animate={isOpen ? 'open' : 'closed'} className="z-10 overflow-hidden  flex items-center justify-center space-x-4">
        <motion.div variants={leftVariants}>
          <IonButton
            className='customize-button'
            shape="round"
            mode="ios"
            onClick={() => onOpenGallery()}
          >
            <IonIcon className="h-12 w-12" icon={arrowUpCircleOutline} />
          </IonButton>
        </motion.div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <IonButton
            className={isOpen ? `customize-button` : ``}
            shape="round"
            mode="ios">
            <div className={isOpen ? `h-12 w-12` : `h-10 w-10 -ml-4`}>
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                className="flex items-center"
              >

                <IonIcon className={isOpen ? `h-12 w-12` : `h-10 w-10`} icon={addCircle} slot="start" />
              </motion.div>
            </div>
            {!isOpen && <span className="ml-2">Customise</span>}
          </IonButton>
        </motion.button>
        <motion.div variants={rightVariants}>
          <IonButton
            className='customize-button'
            shape="round"
            mode="ios"
            onClick={() => onTakePhoto()}
          >
            <IonIcon className="h-12 w-12" icon={radioButtonOnOutline} />
          </IonButton>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CustomiseImageCircles;
