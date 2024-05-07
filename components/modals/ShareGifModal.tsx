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
} from '@ionic/react';
import GifCard from '../ui/GifCard';
import { IGif } from '../../mock';
import { shareOutline, downloadOutline, copyOutline } from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';

const ShareGifModal = ({
  open,
  onDidDismiss,
  gif,
}: {
  gif: IGif | null;
  open: boolean;
  onDidDismiss: () => void;
}) => {
  const router = useIonRouter();
  const buttonData = [
    {
      title: 'Share',
      icon: shareOutline,
      color: 'primary', // Set the color for the button; assuming Ionic color names are used
      handler: () => {
        console.log('Share button clicked');
        // Add your share functionality here
      },
    },
    {
      title: 'Copy',
      icon: copyOutline,
      color: 'secondary',
      handler: async (src: string) => {
        if (Capacitor.isNativePlatform()) {
          await Clipboard.write({
            image: src,
          });
        } else {
          await Clipboard.write({
            string: src,
          });
        }
        console.log(src);
      },
    },
    {
      title: 'Save',
      icon: downloadOutline,
      color: 'tertiary',
      handler: () => {
        console.log('Save button clicked');
        // Add your save functionality here
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
                        onClick={() => button.handler(gif.src)}
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
