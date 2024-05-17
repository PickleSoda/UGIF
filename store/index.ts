import { Store as PullStateStore } from 'pullstate';
import { Preferences } from '@capacitor/preferences';
import {
  notifications,
  settings,
  HomeItem,
  NotificationItem,
  Settings,
  Task,
} from '../mock';

type StoreProps = {
  homeItems: HomeItem[];
  notifications: NotificationItem[];
  settings: Settings;
  tasks: Task[];
};

const Store = new PullStateStore<StoreProps>({
  homeItems: [],
  notifications,
  settings,
  tasks: [],
});

Store.createReaction(
  state => state,
  (state: StoreProps) => {
    Preferences.set({ key: 'appStore', value: JSON.stringify(state) });
    document.documentElement.classList.toggle('dark');
  },
);

export async function initializeAppState() {
  console.log('Initializing user state');
  const savedState = await Preferences.get({ key: 'appStore' });
  if (savedState && typeof savedState.value === 'string') {
    const parsedState = JSON.parse(savedState.value);
    Store.update(state => ({
      ...parsedState,
    }));
  }
  Store.update(state => ({  
    ...state,
    homeItems: [],
  }));
}

export default Store;