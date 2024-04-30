import { Store as PullStateStore } from 'pullstate';

import { lists,  notifications, settings, TodoListItem, HomeItem, NotificationItem, Settings, Task } from '../mock';






type StoreProps = {
  safeAreaTop: number;
  safeAreaBottom: number;
  menuOpen: boolean;
  notificationsOpen: boolean;
  currentPage: number | null;
  homeItems: HomeItem[];
  lists: TodoListItem[];
  notifications: NotificationItem[];
  settings: Settings;
  selectedList: TodoListItem | undefined;
  tasks: Task[]; 
}

const Store = new PullStateStore<StoreProps>({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  menuOpen: false,
  notificationsOpen: false,
  currentPage: null,
  homeItems: [],
  lists,
  notifications,
  settings,
  selectedList: undefined,
  tasks: [], 
});

export default Store;
