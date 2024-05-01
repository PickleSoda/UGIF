import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonToggle,
  IonButton,
} from '@ionic/react';

import Store from '../../store';
import { setSettings, logoutUser } from '../../store/actions';

const Settings = () => {
  const settings = Store.useState(s => s.settings);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonToggle
              checked={settings.enableNotifications}
              onIonChange={e => {
                setSettings({
                  ...settings,
                  enableNotifications: e.target.checked,
                });
              }}
            >
              <h3>

              Enable Notifications
              </h3>
            </IonToggle>
          </IonItem>
          <IonItem>
            <IonButton

              fill="clear"
              color="dark"
              expand="block"
               onClick={() => logoutUser()}>
              <h3>

              Logout
              </h3>
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
