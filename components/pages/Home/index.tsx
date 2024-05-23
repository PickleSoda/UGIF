import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import React, { useState } from 'react';
import Gifs from './Gifs';
import Videos from './Videos';

const Home = () => {
  const [selectedSegment, setSelectedSegment] = useState('GIF');
  return (
    <IonPage className="bg-color">
      <IonHeader mode="ios" className="container">
        <IonToolbar className="custom-toolbar p-2 mt-2">
          <IonSegment
            style={{ width: '100%' }}
            mode="ios"
            className="video-gif"
            value={selectedSegment}
            onIonChange={ev => {
              ev.detail.value && setSelectedSegment(ev.detail.value.toString());
              console.log(selectedSegment);
            }}
          >
            <IonSegmentButton
              mode="ios"
              value="GIF"
              className="video-gif-button"
            >
              <IonLabel>GIF</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              mode="ios"
              value="Video"
              className="video-gif-button"
            >
              <IonLabel>Video</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className="bg-color z-50">
        {selectedSegment === 'GIF' ? <Gifs /> : <Videos />}
      </IonContent>
    </IonPage>
  );
};

export default Home;
