import { Store as PullStateStore } from 'pullstate';
import { Preferences } from '@capacitor/preferences';
import { request } from "../lib/axios";

import {
  notifications,
  settings,
  HomeItem,
  NotificationItem,
  Settings,
  Task,
} from '../mock';

enum Category {
  Gif = "gif",
  Video = "video"
}

interface CategorizedItem {
  id: string;
  name: string;
  category: Category;
}

type StoreProps = {
  gifs: HomeItem[];
  notifications: NotificationItem[];
  settings: Settings;
  tasks: Task[];
  videos: any[];
  categories: CategorizedItem[];
};

const Store = new PullStateStore<StoreProps>({
  gifs: [],
  notifications,
  settings,
  tasks: [],
  videos: [],
  categories: []
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
  if (savedState.value) {
    const parsedState = JSON.parse(savedState.value);
    Store.update(state => ({
      ...state,
      ...parsedState
    }));
  }

  const currentState = Store.getRawState();
  if (currentState.categories && currentState.categories.some(cat => cat.category === Category.Gif || cat.category === Category.Video)) {
    console.log("Categories already initialized with required data.");
    return;
  }

  try {
    const response = await request({
      url: 'https://gifs.unclothed.com/gifs/fetch_categories',
      method: 'post',
    });

    const gifs = response.data.gifs.map((gif: any) => ({
      id: gif.toLowerCase().replace(/\s/g, '-'),
      name: gif,
      category: Category.Gif
    }));

    const movies = response.data.movies.map((movie: any) => ({
      id: movie.toLowerCase().replace(/\s/g, '-'),
      name: movie,
      category: Category.Video
    }));

    // Clear existing categories if any, then update with new data
    Store.update(state => ({
      ...state,
      categories: [...gifs, ...movies]
    }));

    console.log('Categories initialized:', Store.getRawState().categories);

  } catch (error) {
    console.error('Failed to fetch GIFs and Movies:', error);
    Store.update(state => ({
      ...state,
      categories: [],
    }));
  }
}

export default Store;