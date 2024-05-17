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
  // origin: string;
  // localPath: string;
}

export interface IUser {
  isAuth: boolean;
  username: string;
  email: string; 
  token: string;
  gifs: IGif[];
  videos: IGif[];
  balance: number;
}


export const colors = ['#ae2012', '#f9844a', '#f9c74f', '#43aa8b', '#577590']; // Array of hex color codes


export const generateRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const points = [
  {
    label: '$4.99 - 5 Credits',
    type: 'radio',
    value: 5,
  },
  {
    label: '$14.99 - 20 Credits',
    type: 'radio',
    value: 20,
  },
  {
    label: '$29.99 - 50 Credits',
    type: 'radio',
    value: 50,
  },
  {
    label: '$49.99 - 100 Credits',
    type: 'radio',
    value: 100,
  },
  {
    label: '$99.99 - 200 Credits',
    type: 'radio',
    value: 200,
  },
  {
    label: '$399.99 - 1000 Credits',
    type: 'radio',
    value: 1000,
  },
  {
    label: '$499.99 - 2500 Credits',
    type: 'radio',
    value: 2500,
  },
];
