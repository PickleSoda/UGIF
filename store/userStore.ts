import { Store as PullStateStore } from 'pullstate';
import { Preferences } from '@capacitor/preferences';
import { IUser } from '../mock';

const initialState: IUser = {
  isAuth: false,
  username: '',
  email: '',
  token: '',
  gifs: [],
  balance: 0,
  tasks: [],
};

const userStore = new PullStateStore(initialState);

export async function initializeUserState() {
  console.log('Initializing user state');
  const savedState = await Preferences.get({ key: 'userState' });
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
export { userStore };
