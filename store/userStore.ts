import { Store as PullStateStore } from 'pullstate';
import { Preferences } from '@capacitor/preferences';
import { createPullstateCore } from 'pullstate';

interface IGif {
  src: string;
}

export interface IUser {
  isAuth: boolean;
  username: string;
  email: string; // Add an array of Habit objects
  token: string;
  gifs: IGif[];
}
const initialState: IUser = {
  isAuth: false,
  username: '',
  email: '',
  token: '',
  gifs: [],
};

const userStore = new PullStateStore(initialState);

// Existing actions
const setUser = (user: IUser) => userStore.update(() => user);
const setAuth = (isAuth: boolean) =>
  userStore.update((state: IUser) => ({ ...state, isAuth }));
const setUsername = (username: string) =>
  userStore.update(state => ({ ...state, username }));
const setEmail = (email: string) =>
  userStore.update(state => ({ ...state, email }));
const addGif = (gif: IGif) =>
  userStore.update(state => ({ ...state, gifs: [...state.gifs, gif] }));
const removeGif = (id: string) =>
  userStore.update(state => ({
    ...state,
    gifs: state.gifs.filter(gif => gif.src !== id),
  }));
// New actions for managing habits

export async function initializeUserState() {
  console.log('Initializing user state');
  const savedState = await Preferences.get({ key: 'userState' });
  console.log(savedState);
  if (savedState && typeof savedState.value === 'string') {
    const parsedState = JSON.parse(savedState.value);
    userStore.update(state => ({
      ...parsedState,
    }));
  }
}

userStore.createReaction(
  state => state,
  (state: IUser) => {
    Preferences.set({ key: 'userState', value: JSON.stringify(state) });
    document.documentElement.classList.toggle('dark');
  },
);
// Export the store and actions
export {
  userStore,
  setUser,
  setAuth,
  setUsername,
  setEmail,
  addGif,
  removeGif,
};
