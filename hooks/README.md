# Hooks Directory Documentation

This document outlines the custom React hooks defined in the `hooks` directory. These hooks are designed to encapsulate complex functionalities such as state management, API interactions, and specific user interactions like alerts and camera access.

## Files and Hooks

### useAlerts

This hook manages various types of alerts within the application, utilizing `useIonAlert` from `@ionic/react`.

#### Key Functions

- `showPaymentAlert`: Shows an alert for purchasing credits with multiple payment options and handles the payment process.
- `showErrorAlert`: Displays an error alert with custom messages.
- `showLogoutAlert`: Shows a logout confirmation alert.

### useBalance

Manages the user's balance by fetching and updating it from the server. This hook integrates with the `userStore` for state management.

#### Key Functions

- `fetchBalance`: Fetches the current balance from the server and updates the state.

### useGifs

Manages GIFs displayed on the home screen, including fetching from an API and updating the local state in `Store`.

#### Key Functions

- `fetchGifs`: Fetches new GIFs based on pagination and updates the home items state.
- `handleInput`: Filters the displayed GIFs based on user input.
- `handleRefresh`: Handles refresh logic for re-fetching GIFs.

### usePhotoGallerynpm install react-virtualized --save

Provides functionalities related to photo management, including taking photos, resizing, and saving them both locally and to a media library.

#### Key Functions

- `takePhoto`: Captures a photo using the device's camera.
- `loadSavedFolder`: Loads photos saved in a specific folder.
- `downloadAndSaveFile`: Downloads a file from a URL and saves it locally.
- `saveToMedia`: Saves a photo to the device's media library.

### usePollTasks

Polls for updates on tasks from a backend service and updates the application state accordingly. This hook uses Axios for HTTP requests and integrates with the `userStore`.

#### Key Functions

- Periodically checks the status of tasks and updates the GIF and task state based on the server's response.

## Developer Notes

- Each hook is designed to be reusable and encapsulate specific functionalities to reduce complexity in components.
- Ensure that any changes to hooks are tested thoroughly, especially those that interact with external APIs or involve state management.
- Document any new hooks or significant changes to existing hooks here to maintain clarity for all team members.

This documentation should be kept up-to-date as modifications or additions are made to the hooks to facilitate easy understanding and maintenance by the development team.
