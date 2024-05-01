import Store from '.';
import { userStore } from './userStore';
import { Settings, Task, IUser, IGif } from '../mock';

export const setSettings = (settings: Settings) => {
  Store.update(s => {
    s.settings = settings;
  });
};

export const addTask = (task: Task) => {
  Store.update(s => {
    s.tasks.push(task);
  });
};

export const removeTask = (taskId: string) => {
  Store.update(s => {
    s.tasks = s.tasks.filter(t => t.id !== taskId);
  });
};

export const addGifTask = (task: Task) => {
  addTask(task);
  addGif({ id: task.id, status: task.status, src: '' });
};

export const addGif = (gif: IGif) =>
  userStore.update(state => ({ ...state, gifs: [...state.gifs, gif] }));

export const removeGif = (id: string) =>
  userStore.update(state => ({
    ...state,
    gifs: state.gifs.filter(gif => gif.src !== id),
  }));

export const updateGif = (id: string, status: IGif['status'], src: string) =>
  userStore.update(state => ({
    ...state,
    gifs: state.gifs.map(gif =>
      gif.id === id ? { ...gif, status, src } : gif,
    ),
  }));

export const loginUser = ({
  username,
  password,
  token,
}: {
  username: string;
  password: string;
  token: string;
}) => {
  userStore.update(s => {
    s.isAuth = true;
    s.username = username;
    s.email = password;
    s.token = token;
  });
};

export const logoutUser = () => {
  userStore.update(s => {
    s.isAuth = false;
    s.username = '';
    s.email = '';
    s.token = '';
  });
};
