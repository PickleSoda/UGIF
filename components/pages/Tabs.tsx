import { Redirect, Route } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { cog, flash, list } from 'ionicons/icons';

import Settings from './Settings';
import Gifs from './Gifs';
import MyGifs from './MyGifs';
const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/gifs" render={() => <Gifs />} exact={true} />
        {/* <Route path="/lists" render={() => <Lists />} exact={true} />
        <Route
          path="/lists/:listId"
          render={() => <ListDetail />}
          exact={true}
        /> */}
        <Route path="/my-gifs" render={() => <MyGifs />} exact={true} />
        <Route path="/settings" render={() => <Settings />} exact={true} />
        <Route path="" render={() => <Redirect to="/gifs" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/gifs">
          <IonIcon icon={flash} />
          <IonLabel>GIFs</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="tab2" href="/my-gifs">
          <IonIcon icon={list} />
          <IonLabel>My GIFs</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/settings">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
