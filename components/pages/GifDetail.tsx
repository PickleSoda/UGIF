import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton, // Import IonButton
  } from '@ionic/react';
  import { useParams } from 'react-router-dom';
  import { usePhotoGallery } from '../../hooks/usePhotoGallery';
  import Store from '../../store';
  import * as selectors from '../../store/selectors';
  import GifCard from '../ui/GifCard';
  
  type GifDetailParams = {
    id: string;
  };
  
  const ListDetail = () => {
    const items = Store.useState(selectors.selectHomeItems);
    const params = useParams<GifDetailParams>();
    const { id } = params;
    const loadedList = items.find((l) => l.id === id);
    const { takePhoto } = usePhotoGallery();
  
    // Function to handle the button click
    const handleTakePhoto = () => {
      const photo = takePhoto();
      
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/lists" />
            </IonButtons>
            <IonTitle>{loadedList ? loadedList.id : 'Detail'}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {loadedList && <GifCard {...loadedList} />}
          <IonButton onClick={handleTakePhoto}>Take Photo</IonButton> {/* Add the button to take a photo */}
        </IonContent>
      </IonPage>
    );
  };
  
  export default ListDetail;
  