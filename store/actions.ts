import Store from '.';
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

