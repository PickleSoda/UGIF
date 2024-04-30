import Store from '.';
import { ListItem, Settings, TodoListItem, Task } from '../mock';

export const setMenuOpen = (open: boolean) => {
  Store.update(s => {
    s.menuOpen = open;
  });
};

export const setNotificationsOpen = (open: boolean) => {
  Store.update(s => {
    s.notificationsOpen = open;
  });
};

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
// App-specific actions

export const setDone = (
  list: TodoListItem,
  listItem: ListItem,
  done: boolean,
) => {
  Store.update((s, o) => {
    const listIndex = o.lists.findIndex(l => l === list);
    const items = o.lists[listIndex].items;
    const itemIndex = items?.findIndex(i => i === listItem);
    const item = items?.[itemIndex ?? -1];
    if (!item) return;
    item.done = done;
    if (list === o.selectedList) {
      s.selectedList = s.lists[listIndex];
    }
  });
};
