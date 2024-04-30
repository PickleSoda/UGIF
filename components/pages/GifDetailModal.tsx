import {
  IonIcon,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  IonButton,
  IonImg, // Import IonImg for displaying images
} from '@ionic/react';
import { useState } from 'react'; // Import useState
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
import Store from '../../store';
import GifCard from '../ui/GifCard';
import axios from 'axios';
import { close } from 'ionicons/icons';
import { addTask } from '../../store/actions';

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

    axios.post('https://proxy.unclothed.com/gen_video', {
      image: base64Photo,
      video_id: id
    })
      .then(response => {
        console.log('Response:', response.data.task_id);
        addTask(response.data.task_id);
      }
      )
      .catch(error => {
        console.error(error);
      });

  };
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
        {photo && <>
          <IonImg src={photo} />
        </>}
        <IonButton onClick={handleTakePhoto}>{photo ? 'Retake photo' : 'Take Photo'}</IonButton>
        {
          // Display the 'Generate GIF' button only if there's a photo
          photo && <IonButton onClick={handleGenerateGif}>Generate GIF</IonButton>
        }
      </IonContent>
    </IonModal>
  );
};

export default GifDetailModal;
