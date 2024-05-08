import { IonPage, IonContent, IonText } from '@ionic/react';
import { Virtuoso } from 'react-virtuoso';
import { useState, useEffect } from 'react';
import { userStore } from '../../store/userStore';
import GifCard from '../ui/GifCard';
import NanCard from '../ui/NanCard';
import ShareGifModal from '../modals/ShareGifModal';
import { IGif } from '../../mock';
const MyGifs = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedGif, setSelectedGif] = useState<IGif | null>(null);
  const gifs = userStore.useState(s => s.gifs);
  const openShareModal = (gif: IGif) => {
    setShowShareModal(true);
    setSelectedGif(gif);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        {
          gifs.length === 0 && (
            <IonText className="ion-text-center ion-padding absolute w-full top-1/2 -translate-y-1/2">
              <h1>No GIFs found</h1>
            </IonText>
          )
        }
        <Virtuoso
          className="ion-content-scroll-host"
          style={{ height: '100%' }}
          data={[...gifs].reverse() || []}
          itemContent={(index, gif) => {
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
          }}
        />
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
