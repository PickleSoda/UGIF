import {
  IonIcon,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  IonButton,
  useIonLoading,
  useIonAlert,
  useIonRouter,
} from '@ionic/react';
import { close } from 'ionicons/icons';


import { request } from "../../lib/axios";
import Store from '../../store';
import { addGifTask } from '../../store/actions';

import { useState } from 'react'; // Import useState
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
import GifCard from '../ui/GifCard';
import NanCard from '../ui/NanCard';

const GifDetailModal = ({
  open,
  onDidDismiss,
  id
}: {
  id: string;
  open: boolean;
  onDidDismiss: () => void;
}) => {
  const items = Store.useState(s => s.homeItems);
  const loadedList = items?.find((l) => l.id === id);
  const { takePhoto, getPhotoAsBase64 } = usePhotoGallery();
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const router = useIonRouter()

  // Function to handle the button click
  const handleTakePhoto = async () => {
    const photoData = await takePhoto();
    console.log('Photo taken:', photoData);
    setPhoto(photoData.webviewPath);
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
      url: "/videos/generate",
      method: "post",
      data: {
        image: base64Photo,
        video_id: id
      }
    })
      .then(response => {
        dismiss();

        console.log('Response:', response.data.task_id);
        addGifTask(
          {
            id: response.data.task_id,
            status: 'processing'
          }
        );
        router.push('/my-gifs', 'root', 'push')
      })
      .catch(error => {
        dismiss();
        presentAlert({
          header: 'Error!',
          subHeader: 'Something went wrong.',
          // message: 'A message should be a short, complete sentence.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Alert canceled');
              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: () => {
                console.log('Alert confirmed');
              },
            },
          ],
        })
        console.error(error);
      });

  };
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  return (
    <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Your GIF</IonTitle>
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
      <IonContent fullscreen>
        {loadedList && <GifCard {...loadedList} />}
        {photo ? <>
          <GifCard src={photo} />
        </> :
          <NanCard spinner={false} />}
        <div className='flex flex-col items-center justify-center'>

          <IonButton onClick={handleTakePhoto}>{photo ? 'Retake photo' : 'Take Photo'}</IonButton>
          {
            // Display the 'Generate GIF' button only if there's a photo
            photo && <IonButton onClick={handleGenerateGif}>Generate GIF</IonButton>
          }
        </div>
      </IonContent>
    </IonModal>
  );
};

export default GifDetailModal;
