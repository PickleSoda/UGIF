import { Redirect, Route } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonChip,
} from '@ionic/react';
import { person, grid, settings } from 'ionicons/icons';
import Store from '../../store';
import Settings from './Settings';
import Home from './Home';
import MyGifs from './MyGifs';
const Tabs = () => {
  const currentTasks = Store.getRawState()?.tasks;
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/gifs" render={() => <Home />} exact={true} />
        <Route path="/my-gifs" render={() => <MyGifs />} exact={true} />
        <Route path="/settings" render={() => <Settings />} exact={true} />
        <Route path="" render={() => <Redirect to="/gifs" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="floating-tab-bar" mode="md">
        <IonTabButton tab="tab1" href="/gifs" className="floating-tab-button">
          <IonIcon icon={grid} />
        </IonTabButton>
        <IonTabButton
          tab="tab2"
          href="/my-gifs"
          className="floating-tab-button"
        >
          {currentTasks.length ? (
            <IonChip className="notificationChip" color="danger">
              {currentTasks.length}
            </IonChip>
          ) : (
            <span />
          )}
          <IonIcon icon={person} />
        </IonTabButton>
        <IonTabButton
          tab="tab3"
          href="/settings"
          className="floating-tab-button"
        >
          <IonIcon icon={settings} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
