# App Data Types Documentation

This document provides an overview of the data types used in the application. It includes descriptions of each type and their intended use within the app. This should aid in understanding how data is structured and manipulated across different components of the application.

## Types

### HomeItem

Represents an item displayed on the home page of the app.

- `id`: A unique identifier for the item, of type `string`.
- `src`: A string indicating the source URL for the item's content.

### TaskStatus

Enumerates the possible states of a task within the application.

- Possible values: `'processing'`, `'completed'`, `'failed'`.

### Task

Describes a task with an associated status.

- `id`: A unique identifier for the task, of type `string`.
- `status`: A `TaskStatus` indicating the current state of the task.

### NotificationItem

Represents a notification sent to users.

- `id`: A numerical ID unique to each notification.
- `title`: The title of the notification.
- `when`: A timestamp or relative descriptor (e.g., '6 hr', '1 day') indicating when the notification was sent.

### ListItem

Defines an item within a list, used for tasks or checklists.

- `name`: The name of the list item.
- `done`: An optional boolean flag indicating whether the item has been completed.

### TodoListItem

Represents a todo list with multiple items.

- `name`: The name of the todo list.
- `id`: A unique identifier for the list.
- `items`: An optional array of `ListItem` representing the tasks within the list.

### Settings

Stores user-specific settings.

- `enableNotifications`: A boolean indicating whether notifications are enabled for the user.

### IGif

Describes a GIF item, including its origin and local storage path.

- `id`: A unique identifier for the GIF.
- `status`: A `TaskStatus` indicating the current state of the GIF.
- `src`: The source URL of the GIF.
- `origin`: The original URL from where the GIF was sourced.
- `localPath`: The local storage path of the GIF.

### IUser

Defines a user profile within the app.

- `isAuth`: A boolean indicating if the user is authenticated.
- `username`: The user's username.
- `email`: The user's email address.
- `token`: Authentication token for the user.
- `gifs`: An array of `IGif` representing the GIFs associated with the user.
- `balance`: A numerical balance or credits available to the user.
- `tasks`: An array of `Task` representing the user's ongoing tasks.

### Color and Points

- `colors`: An array of string hex codes representing different colors used within the app.
- `points`: An array of objects representing different credit purchasing options, each with a label, type, and value.

## Utility Functions

### generateRandomColor

Returns a random color from the predefined `colors` array.

