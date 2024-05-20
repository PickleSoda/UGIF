import Store from '.';
import { userStore } from './userStore';
import { Settings, Task, IUser, IGif, ICategory } from '../mock';

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


export const addGif = (gif: IGif) =>
  userStore.update(state => ({ ...state, gifs: [...state.gifs, gif] }));

export const addCategory = (category: ICategory) =>
  userStore.update(state => ({ ...state, categories: [...state.categories, category] }));

export const removeCategory = (id: string) =>
  userStore.update(state => ({
    ...state,
    categories: state.categories.filter(category => category.id !== id),
  }));

export const addVideo = (video: IGif) =>
  userStore.update(state => ({ ...state, videos: [...state.videos, video] }));

export const removeGif = (id: string) =>
  userStore.update(state => ({
    ...state,
    gifs: state.gifs.filter(gif => gif.id !== id),
  }));
  export const removeVideo = (id: string) =>
  userStore.update(state => ({
    ...state,
    videos: state.videos.filter(video => video.id !== id),
  }));
  
  export const updateGif = (id: string, status: IGif['status'], src: string) =>
  userStore.update(state => ({
    ...state,
    gifs: state.gifs.map(gif =>
      gif.id === id ? { ...gif, status, src } : gif,
    ),
  }));
  export const updateVideo = (id: string, status: IGif['status'], src: string) =>
  userStore.update(state => ({
    ...state,
    videos: state.videos.map(video =>
      video.id === id ? { ...video, status, src } : video,
    ),
  }));

  export const addGifTask = (task: Task) => {
    addTask(task);
    addGif({ id: task.id, status: task.status, src: '' });
  };

  export const addVideoTask = (task: Task) => {
    addTask(task);
    addVideo({ id: task.id, status: task.status, src: '' });
  }
  
export const loginUser = ({
  username,
  token,
}: {
  username: string;
  token: string;
}) => {
  userStore.update(s => {
    s.isAuth = true;
    s.username = username;
    s.token = token;
  });
};

export const logoutUser = () => {
  userStore.update(s => {
    s.isAuth = false;
    s.username = '';
    s.token = '';
    s.gifs = [];
    s.balance = 1;
  });
};


export const updateUserBalance = (newBalance: number) => {
  userStore.update(s => {
      s.balance = newBalance;
  });
};