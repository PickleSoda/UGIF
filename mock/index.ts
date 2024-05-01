export type HomeItem = {
  id: string;
  src: string;
};

export type Task = {
  id: string;
  status?: 'processing' | 'completed' | 'failed'; // Additional attributes like status can be added here
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
export const lists: TodoListItem[] = [
  {
    name: 'Groceries',
    id: '01HRCYTYED31N83MJ0WK97WC02',
    items: [
      { name: 'Apples' },
      { name: 'Bananas' },
      { name: 'Milk' },
      { name: 'Ice Cream' },
    ],
  },
  {
    name: 'Hardware Store',
    id: '01HRCYV2KPNJQJ43Y7X526BHVX',
    items: [
      { name: 'Circular Saw' },
      { name: 'Tack Cloth' },
      { name: 'Drywall' },
      { name: 'Router' },
    ],
  },
  {
    name: 'Work',
    id: '01HRCYV6C3YWAJRF2ZE7AZ17K7',
    items: [{ name: 'TPS Report' }, { name: 'Set up email' }],
  },
  {
    name: 'Reminders',
    id: '01HRCYVADRPCM5SYV5BH98C7HS',
    items: [{ name: 'Get car inspection', done: true }],
  },
];

export type Settings = {
  enableNotifications: boolean;
};

export const settings: Settings = {
  enableNotifications: true,
};
