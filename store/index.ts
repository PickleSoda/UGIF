import { Store as PullStateStore } from 'pullstate';

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

export default Store;
