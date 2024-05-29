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
import { motion } from 'framer-motion';

const Home = () => {
  const [selectedSegment, setSelectedSegment] = useState<'GIF' | 'Video'>(
    'GIF',
  );
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
              ev.detail.value &&
                setSelectedSegment(
                  ev.detail.value.toString() == 'GIF' ? 'GIF' : 'Video',
                );
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {selectedSegment === 'GIF' ? <Gifs /> : <Videos />}
        </motion.div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
