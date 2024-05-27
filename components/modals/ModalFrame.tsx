import React from 'react';
import { IonModal, createAnimation } from '@ionic/react';
import { AnimatePresence, motion } from 'framer-motion';
import Store from '../../store';
import GifCard from '../ui/GifCard';
import NanCard from '../ui/NanCard';
import { useState } from 'react';
import { useIonLoading } from '@ionic/react';
import { request } from '../../lib/axios';
import useAlerts from '../../hooks/useAlerts';
import { addGifTask, addVideoTask } from '../../store/actions';
import { App } from '@capacitor/app';
import PhotoSelectSection from '../ui/PhotoSelectSection';
function ModalFrame({
  open,
  onDidDismiss,
  id,
  type,
}: {
  open: boolean;
  onDidDismiss: () => void;
  id: string;
  type: 'gif' | 'video';
}) {
  const items = Store.useState(s => (type == 'gif' ? s.gifs : s.videos));
  const media = items?.find(l => l.id === id);
  const [base64Photo, setBase64Photo] = useState<string | undefined>(undefined);
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const { showPaymentAlert, showErrorAlert } = useAlerts();
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
        onDidDismiss();
        console.log('Response:', response.data.task_id);

        type == 'gif'
          ? addGifTask({
              id: response.data.task_id,
              status: 'processing',
            })
          : addVideoTask({
              id: response.data.task_id,
              status: 'processing',
            });
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
  const selectPhoto = (photo: any) => {
    setPhoto(photo.photo);
    setBase64Photo(photo.base64Photo);
    console.log('photo selected', photo);
  };
  const hanldeClose = () => {
    //   setIsOpen(false);
    setPhoto(undefined);
    setBase64Photo(undefined);
    onDidDismiss();
  };
  App.addListener('backButton', () => {
    hanldeClose();
  });
  const [present, dismiss] = useIonLoading();
  const enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = createAnimation()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(50)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl: HTMLElement) => {
    return enterAnimation(baseEl).direction('reverse');
  };
  return (
    <IonModal
      id="example-modal"
      isOpen={open}
      onDidDismiss={onDidDismiss}
      enterAnimation={enterAnimation}
      leaveAnimation={leaveAnimation}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => hanldeClose()}
            className="w-full h-full max-w-lg cursor-default"
          >
            <motion.div
              initial={{ scale: 0, rotate: '12.5deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              exit={{ scale: 0, rotate: '0deg' }}
              className="px-6 absolute w-full  bottom-64"
            >
              {media ? (
                <>
                  {type == 'gif' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 1 }}
                      onClick={e => e.stopPropagation()}
                      className={`h-full`}
                    >
                      <GifCard {...media} />
                    </motion.div>
                  ) : (
                    <video controls onClick={e => e.stopPropagation()}>
                      <source src={media.src} type="video/mp4" />
                    </video>
                  )}
                  <div
                    className={`h-full  ${media?.ratio > 1 && 'mb-10'}`}
                  ></div>
                </>
              ) : (
                <NanCard spinner />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-full bottom-24 px-6"
              onClick={e => e.stopPropagation()}
            >
              <PhotoSelectSection
                onPhotoSelect={selectPhoto}
                onGenerateContent={handleGenerateGif}
              ></PhotoSelectSection>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </IonModal>
  );
}

export default ModalFrame;
