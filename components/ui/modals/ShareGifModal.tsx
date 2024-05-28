import {
  IonIcon,
  IonContent,
  IonModal,
  IonButton,
  useIonRouter,
  IonLabel,
  IonGrid,
  IonCol,
  IonRow,
  useIonLoading,
} from '@ionic/react';
import GifCard from '../Cards/GifCard';
import { IGif } from '../../../mock';
import { shareOutline, downloadOutline, copyOutline } from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { usePhotoGallery } from '../../../hooks/usePhotoGallery';

const ShareGifModal = ({
  open,
  onDidDismiss,
  gif,
}: {
  gif: IGif | null;
  open: boolean;
  onDidDismiss: () => void;
}) => {
  const { saveToMedia } = usePhotoGallery();
  const [present, dismiss] = useIonLoading();
  const buttonData = [
    {
      title: 'Share',
      icon: shareOutline,
      color: 'primary', // Set the color for the button; assuming Ionic color names are used
      handler: async (gif: IGif) => {
        await Share.share({
          url: gif.src,
        });
        console.log('Share button clicked');
        // Add your share functionality here
      },
    },
    {
      title: 'Copy',
      icon: copyOutline,
      color: 'secondary',
      handler: async (gif: IGif) => {
        if (Capacitor.isNativePlatform()) {
          await Clipboard.write({
            image: gif.src,
          });
        } else {
          await Clipboard.write({
            string: gif.src,
          });
        }
        console.log(gif.src);
      },
    },
    {
      title: 'Save',
      icon: downloadOutline,
      color: 'tertiary',
      handler: async (gif: IGif) => {
        console.log('Save button clicked');
        present({
          message: 'Saving...',
          duration: 200,
        });
        try {
          await saveToMedia(gif.src, gif.id);
        } catch (e) {
          present({
            message: 'Error saving gif...',
            duration: 300,
          });
          console.error('Error saving media:', e);
        }
      },
    },
  ];
  return (
    <IonModal
      isOpen={open}
      onDidDismiss={onDidDismiss}
      initialBreakpoint={0.25}
      breakpoints={[0.25, 0.75]}
      handleBehavior="cycle"
    >
      <IonContent className="ion-padding">
        <div className="ion-margin-top">
          {gif ? (
            <IonGrid>
              <IonRow>
                {buttonData.map(button => {
                  return (
                    <IonCol
                      key={button.title}
                      className="flex flex-col items-center"
                    >
                      <IonButton
                        className="opacity-70"
                        mode="ios"
                        size="default"
                        shape="round"
                        color={button.color}
                        onClick={() => button.handler(gif)}
                      >
                        <IonIcon
                          slot="icon-only"
                          icon={button.icon}
                          className="absolute text-gray-50"
                        ></IonIcon>
                      </IonButton>
                      {button.title}
                    </IonCol>
                  );
                })}
              </IonRow>
              <IonRow>
                <GifCard src={gif.src} />
              </IonRow>
            </IonGrid>
          ) : (
            <IonLabel>How you open like this?</IonLabel>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ShareGifModal;
