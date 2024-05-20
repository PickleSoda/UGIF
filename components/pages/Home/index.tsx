import {
  IonPage,
  IonHeader,
  IonContent,
  IonSearchbar,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import React, { forwardRef, useState } from 'react';
import Gifs from './Gifs';
import Videos from './Videos';
const Home = () => {
  const [selectedSegment, setSelectedSegment] = useState('GIF');

  return (
    <IonPage className='bg-color'>
      <IonHeader mode='ios' className='container'>
        <IonToolbar className="custom-toolbar p-2 mt-2">
          <IonSegment
          style={{ width: '100%'}}
            mode="ios"
            value={selectedSegment}
            onIonChange={ev => {
              ev.detail.value && setSelectedSegment(ev.detail.value.toString());
              console.log(selectedSegment);
            }}
          >
            <IonSegmentButton mode="ios" value="GIF">
              <IonLabel>GIF</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton mode="ios" value="Video">
              <IonLabel>Video</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className='bg-color'>
        <div className="my-4 p-1">
        </div>
        <div>
          {selectedSegment === 'GIF' ? (
            <div>
              <Gifs />
            </div>
          ) : (
            <div>
              <Videos />
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Home;
