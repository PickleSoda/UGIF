export type HomeItem = {
  id: string;
  src: string;
};

export type TaskStatus = 'processing' | 'completed' | 'failed';

export type Task = {
  id: string;
  status: TaskStatus; // Additional attributes like status can be added here
};

export type NotificationItem = {
  id: number;
  title: string;
  when: string;
};

export const notifications: NotificationItem[] = [
  { id: 1, title: 'New friend request', when: '6 hr' },
  { id: 2, title: 'Please change your password', when: '1 day' },
  { id: 3, title: 'You have a new message', when: '2 weeks' },
  { id: 4, title: 'Welcome to the app!', when: '1 month' },
];

export type ListItem = {
  name: string;
  done?: boolean;
};

export type TodoListItem = {
  name: string;
  id: string;
  items?: ListItem[];
};

// Some fake lists

export type Settings = {
  enableNotifications: boolean;
};

export const settings: Settings = {
  enableNotifications: true,
};
export interface IGif {
  id: string;
  status: TaskStatus;
  src: string;
}

export interface IUser {
  isAuth: boolean;
  username: string;
  email: string; // Add an array of Habit objects
  token: string;
  gifs: IGif[];
  balance: number;
}
