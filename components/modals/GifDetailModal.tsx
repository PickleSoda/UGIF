import {
  IonIcon,
  IonContent,
  IonHeader,
  IonModal,
  IonToolbar,
  IonButton,
  useIonLoading,
  useIonRouter,
} from '@ionic/react';
import {
  close,
  radioButtonOnOutline,
  checkmarkCircleOutline,
  refreshOutline,
  closeOutline,
} from 'ionicons/icons';

import { request } from '../../lib/axios';
import Store from '../../store';
import { addGifTask } from '../../store/actions';
import useAlerts from '../../hooks/useAlerts';
import { useState } from 'react'; // Import useState
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
import GifCard from '../ui/GifCard';
import NanCard from '../ui/NanCard';

const GifDetailModal = ({
  open,
  onDidDismiss,
  id,
}: {
  id: string;
  open: boolean;
  onDidDismiss: () => void;
}) => {
  const items = Store.useState(s => s.homeItems);
  const loadedList = items?.find(l => l.id === id);
  const { takePhoto, getPhotoAsBase64 } = usePhotoGallery();
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const router = useIonRouter();

  const { showPaymentAlert, showErrorAlert } = useAlerts();
  const handleTakePhoto = async () => {
    try {
      const photoData = await takePhoto();
      console.log('Photo taken:', photoData);
      setPhoto(photoData?.webviewPath);
    } catch (error) {
      console.error('Error taking photo:', error);
      // Handle the error here
    }
  };
  const handleGenerateGif = async () => {
    if (!photo) return; // Ensure there's a photo to process
    const base64Photo = await getPhotoAsBase64(photo);
    console.log('Photo as base64:', base64Photo, id);
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
    <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar
          style={{ backgroundColor: 'var(--ion-background-color, #fff)' }}
        >
          <IonButton
            slot="end"
            fill="clear"
            color="dark"
            onClick={onDidDismiss}
          >
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <div className="h-10 text-center font-bold">
          <h1>Upload your image</h1>
        </div>
        {photo ? (
          <div>
            <GifCard src={photo} />
            <div className="flex justify-between">
              <IonIcon
                className="h-10 w-20"
                icon={closeOutline}
                onClick={() => setPhoto(undefined)}
              />
              <IonIcon
                className="h-10 w-20"
                icon={refreshOutline}
                onClick={handleTakePhoto}
              />
            </div>
          </div>
        ) : loadedList ? (
          <GifCard {...loadedList} />
        ) : (
          <NanCard spinner={false} />
        )}
        <div
          className="absolute bottom-0 w-full"
          style={{ backgroundColor: 'var(--ion-background-color, #fff)' }}
        >
          <div className="flex flex-col items-center justify-center ">
            {photo ? (
              <IonIcon
                className="h-20 w-20"
                icon={checkmarkCircleOutline}
                onClick={handleGenerateGif}
              />
            ) : (
              <IonIcon
                className="h-20 w-20"
                icon={radioButtonOnOutline}
                onClick={handleTakePhoto}
              />
            )}
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default GifDetailModal;
