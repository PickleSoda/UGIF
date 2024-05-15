# Store Directory Documentation

This document provides a detailed description of the files within the `store` directory of the application. These files are responsible for managing state, actions, and data persistence across the application.

## Files

### action.ts

Defines the actions that can be dispatched to modify the state of the application. Actions include user authentication, task management, GIF handling, and settings configuration.

#### Key Functions

- `setSettings`: Updates application settings.
- `addTask`, `removeTask`: Functions to add and remove tasks.
- `addGif`, `removeGif`, `updateGif`: Functions to manage GIFs.
- `loginUser`, `logoutUser`: Functions to manage user login states.
- `updateUserBalance`: Updates the user's credit balance.

### index.ts

Serves as the main store file for the app, utilizing `PullStateStore` from the `pullstate` library. It initializes the store with default values for home items, notifications, settings, and tasks.

#### Structure

- `Store`: Contains state definitions for `homeItems`, `notifications`, `settings`, and `tasks`.

### userStore.ts

Manages the persistent user state, integrating with the Capacitor `Preferences` plugin to save and load the state. It includes functions to initialize the user state from stored preferences and reactions to update the storage upon state changes.

#### Key Features

- `initializeUserState`: Loads user state from local storage.
- `userStore.createReaction`: Saves the current state to local storage whenever it changes.
- State includes fields like `isAuth`, `username`, `email`, `token`, `gifs`, `balance`, and `tasks`.

## General Usage

- **State Management**: `index.ts` and `userStore.ts` handle different aspects of the application's state. `index.ts` is mainly for non-user-specific data, while `userStore.ts` focuses on authenticated user data.
- **Action Dispatching**: Actions defined in `action.ts` can be dispatched from components or services within the application to update the state stored in `index.ts` and `userStore.ts`.

## Developer Notes

- Ensure that any changes to state management or actions are reflected in the corresponding TypeScript type definitions to maintain consistency and prevent type errors.
- When modifying `userStore.ts`, consider the implications for data persistence and the user experience upon login and logout.

This documentation should be updated as changes are made to the underlying functionality of the store mechanisms to keep team members aligned with the development process.
