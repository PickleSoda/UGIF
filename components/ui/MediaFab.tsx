import React from 'react';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonImg,
} from '@ionic/react';
import { add, image, camera, save } from 'ionicons/icons';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
type side = 'start' | 'end' | 'top' | 'bottom' | undefined;
function MediaFab({
  photoTaken,
  side,
}: {
  side: side;
  photoTaken: () => Promise<void> | void;
}) {
  const { takePhoto, savePicture } = usePhotoGallery();
  const openCamera = async () => {
    try {
      const photo = await takePhoto();
      console.log('Photo taken:', photo);
      const saved = await savePicture(photo.photo);
      console.log('Photo saved:', saved);
      photoTaken();
      // saveBase64AsFile(photo.base64Data, 'photo');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div>
        <IonFab>
          <IonFabButton size="small">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
          <IonFabList side={side}>
            <IonFabButton onClick={() => openCamera()}>
              <IonIcon icon={camera}></IonIcon>
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={image}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </div>
    </>
  );
}
export default MediaFab;
