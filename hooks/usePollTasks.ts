// usePollTasks.js
import { useEffect } from 'react';
import axios from 'axios';
import Store from '../store'; // Import your store and actions
import { removeTask } from '../store/actions';
import { userStore } from '../store/userStore';

import { addGif,updateGif } from '../store/actions';
import { update } from 'pullstate';
const usePollTasks = () => {
  useEffect(() => {
    const pollTasks = () => {
      // Accessing the current tasks directly from the store
      const currentTasks = Store.getRawState().tasks;

      currentTasks.forEach(task => {
        console.log('Polling task:', task);
        axios
          .post(
            'https://gifs.unclothed.com/videos/get',
            {
              task_id: task.id,
            },
            {
              headers: {
                Authorization: 'Bearer ' + userStore.getRawState().token,
              },
            },
          )

          .then(response => {
            // Handle the response
            console.log('Task response:', response.data);
            if (response.data.status === 'completed') {
              // Remove the task from the store
              removeTask(task.id);
              updateGif(task.id, 'completed', response.data.src);
            }
          })
          .catch(error => console.error('Request error:', error));
      });
    };

    const interval = setInterval(pollTasks, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // This hook does not return anything because it solely handles background tasks
};

export default usePollTasks;
