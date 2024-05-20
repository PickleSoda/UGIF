import {
  IonPage,
  IonContent,
  IonText,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
} from '@ionic/react';
import { Virtuoso } from 'react-virtuoso';
import { useState, useEffect } from 'react';
import { userStore } from '../../store/userStore';
import GifCard from '../ui/GifCard';
import NanCard from '../ui/NanCard';
import ShareGifModal from '../modals/ShareGifModal';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
import { IGif } from '../../mock';

const MyGifs = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedGif, setSelectedGif] = useState<IGif | null>(null);
  const gifs = userStore.useState(s => s.gifs);
  const videos = userStore.useState(s => s.videos);
  const openShareModal = (gif: IGif) => {
    setShowShareModal(true);
    setSelectedGif(gif);
  };
  const [selectedSegment, setSelectedSegment] = useState('GIF');

  return (
    <IonPage>
      <IonHeader>
      </IonHeader>
      <IonContent fullscreen className='bg-color'>
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
        {((gifs.length === 0 && selectedSegment === 'GIF') ||
          (videos.length === 0 && selectedSegment === 'Video')) && (
          <IonText className="ion-text-center ion-padding absolute w-full top-1/2 -translate-y-1/2" color="light">
            <h1>Media not found</h1>
          </IonText>
        )}
        {selectedSegment === 'Video'
          ? videos.map((video, index) => {
              switch (video.status) {
                case 'completed':
                  return (
                    <div key={index}>
                      <video controls>
                        <source src={video.src} type="video/mp4" />
                      </video>
                      <IonButton onClick={() => openShareModal(video)}>
                        <IonLabel>More</IonLabel>
                      </IonButton>
                    </div>
                    // <div onClick={() => openShareModal(video)} key={index}>
                    //   <GifCard key={index} />
                    // </div>
                  );
                case 'processing':
                  return <NanCard spinner={true} key={index} />;
                case 'failed':
                  return <NanCard key={index} spinner={false} />;
                default:
                  return null;
              }
            })
          : gifs.reverse().map((gif, index) => {
              switch (gif.status) {
                case 'completed':
                  return (
                    <div onClick={() => openShareModal(gif)} key={index}>
                      <GifCard key={index} src={gif.src} />
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

        <ShareGifModal
          gif={selectedGif}
          open={showShareModal}
          onDidDismiss={() => setShowShareModal(false)}
        ></ShareGifModal>
      </IonContent>
    </IonPage>
  );
};
export default MyGifs;
