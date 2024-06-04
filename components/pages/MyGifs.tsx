import {
  IonPage,
  IonContent,
  IonText,
  IonHeader,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
} from '@ionic/react';
import { useState } from 'react';
import { userStore } from '../../store/userStore';
import GifCard from '../ui/Cards/GifCard';
import NanCard from '../ui/Cards/NanCard';
import ShareGifModal from '../ui/modals/ShareGifModal';
import { IGif } from '../../mock';
import VideoCard from '../ui/Cards/VideoCard';
import ShareVideoModal from '../ui/modals/ShareVideoModal ';

const MyGifs = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedGif, setSelectedGif] = useState<IGif | null>(null);
  const gifs = userStore.useState(s => [...s.gifs].reverse());
  const videos = userStore.useState(s => [...s.videos].reverse());
  const openShareModal = (source: IGif) => {

    setShowShareModal(true);
    setSelectedGif(source);
  };
  const [selectedSegment, setSelectedSegment] = useState('GIF');

  return (
    <IonPage>
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
      <IonContent fullscreen className="bg-color">
        {((gifs.length === 0 && selectedSegment === 'GIF') ||
          (videos.length === 0 && selectedSegment === 'Video')) && (
          <IonText
            className="ion-text-center ion-padding absolute w-full top-1/2 -translate-y-1/2"
            color="light"
          >
            <h1>Media not found</h1>
          </IonText>
        )}
        {selectedSegment === 'Video'
          ? videos.map((video, index) => {
              switch (video.status) {
                case 'completed':
                  return (
                    <div key={index} onClick={() => openShareModal(video)}>
                      <VideoCard src={video.src} className='pointer-events-none p-2' />
                    </div>
                  );
                case 'processing':
                  return <NanCard spinner={true} key={index} />;
                case 'failed':
                  return <NanCard key={index} spinner={false} />;
                default:
                  return null;
              }
            })
          : gifs.map((gif, index) => {
              switch (gif.status) {
                case 'completed':
                  return (
                    <div
                      onClick={() => openShareModal(gif)}
                      key={index}
                      className="p-4"
                    >
                      <GifCard key={index} src={gif.src} className=''/>
                    </div>
                  );
                case 'processing':
                  return <NanCard spinner={true} key={index} />;
                case 'failed':
                  return <NanCard key={index} spinner={false} />;
                default:
                  return null;
              }
            })}

            {
              selectedSegment === 'GIF' ?(
                <ShareGifModal
                gif={selectedGif}
                open={showShareModal}
                onDidDismiss={() => setShowShareModal(false)}
              ></ShareGifModal>
              ): 
              
              <ShareVideoModal
              gif={selectedGif}
              open={showShareModal}
              onDidDismiss={() => setShowShareModal(false)}
            ></ShareVideoModal>
            }


      </IonContent>
    </IonPage>
  );
};
export default MyGifs;
