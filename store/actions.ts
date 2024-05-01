import Store from '.';
import { userStore } from './userStore';
import { Settings, Task } from '../mock';



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

export   const removeTask = (taskId: string) => {
  Store.update(s => {
    s.tasks = s.tasks.filter(t => t.id !== taskId);
  });
};
export const loginUser = ({ username, password, token }: { username: string, password: string, token: string }) => {
  userStore.update(s => {
    s.isAuth = true;
    s.username = username;
    s.email = password; 
    s.token = token;
  });
}
export const logoutUser = () => {
  userStore.update(s => {
    s.isAuth = false;
    s.username = '';
    s.email = '';
    s.token = '';
  });
}
