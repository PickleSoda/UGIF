import { IonButton, IonLabel, IonIcon } from '@ionic/react';
import { AnimatePresence, motion } from 'framer-motion';
import Store from '../../store';
import GifCard from '../ui/GifCard';
import { addCircle, radioButtonOnOutline } from 'ionicons/icons';
import { useState } from 'react';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
import { useIonLoading, useIonRouter } from '@ionic/react';
import { request } from '../../lib/axios';
import useAlerts from '../../hooks/useAlerts';
import { addGifTask } from '../../store/actions';
import ImageList from '../ui/ImageList';
import MediaFab from '../ui/MediaFab';
type SpringModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  id: string;
};

const SpringModal: React.FC<SpringModalProps> = ({ isOpen, setIsOpen, id }) => {
  const items = Store.useState(s => s.gifs);
  const gif = items?.find(l => l.id === id);
  const { takePhoto } = usePhotoGallery();
  const [base64Photo, setBase64Photo] = useState<string | undefined>(undefined);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const router = useIonRouter();

  const { showPaymentAlert, showErrorAlert } = useAlerts();
  const handleTakePhoto = async () => {
    try {
      const photoData = await takePhoto();
      console.log('Photo taken:', photoData);
      setPhoto(photoData.photo.webPath);
      setBase64Photo(photoData.base64Data);
    } catch (error) {
      console.error('Error taking photo:', error);
      // Handle the error here
    }
    console.log('requesting generation', base64Photo);
    handleGenerateGif();
  };
  const handleGenerateGif = async () => {
    if (!base64Photo) return;
    present({
      message: 'Requesting GIF generation...',
      duration: 10000,
    });
    request({
      url: '/videos/generate',
      method: 'post',
      data: {
        image: base64Photo,
        video_id: id,
      },
    })
      .then(response => {
        dismiss();

        console.log('Response:', response.data.task_id);
        addGifTask({
          id: response.data.task_id,
          status: 'processing',
        });
        router.push('/my-gifs', 'root', 'push');
      })
      .catch(error => {
        dismiss();
        if (error.response && error.response.status === 402) {
          // Call the special function for 402 error
          showPaymentAlert();
        } else {
          showErrorAlert();
        }

        console.error(error);
      });
  };
  const [present, dismiss] = useIonLoading();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: '12.5deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            exit={{ scale: 0, rotate: '0deg' }}
            onClick={e => e.stopPropagation()}
            className=" text-white px-6  rounded-lg w-full max-w-lg cursor-default absolute"
          >
            <div className=" flex flex-col items-center gap-4  z-10">
              {gif ? <GifCard {...gif} /> : <div></div>}

              <div className="w-full max-w-72">
                <ImageList fab="bottom"></ImageList>
              </div>
              <IonButton shape="round" mode="ios">
                <IonIcon
                  className="h-10 w-10 -ml-4"
                  icon={addCircle}
                  slot="start"
                ></IonIcon>
                Customise
              </IonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpringModal;
