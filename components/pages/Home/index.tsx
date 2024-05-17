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
    <IonPage>
      <IonHeader>
        <IonToolbar className="pb-2">
          <IonSearchbar
            debounce={1000}
            onIonInput={ev => console.log(ev)}
            className="custom-searchbar mt-3 "
            showCancelButton="focus"
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="my-4 p-1">
          <IonSegment
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
