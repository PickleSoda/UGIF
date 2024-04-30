// usePollTasks.js
import { useEffect } from 'react';
import axios from 'axios';
import Store from '../store'; // Import your store and actions
import { removeTask } from '../store/actions';
const usePollTasks = () => {
  useEffect(() => {
    const pollTasks = () => {
      // Accessing the current tasks directly from the store
      const currentTasks = Store.getRawState().tasks;

      currentTasks.forEach(task => {
        axios
          .post('https://gifs.unclothed.com/videos/get', {
            task_id: task.id,
          })
          .then(response => {
            // Handle the response
            console.log('Task response:', response.data);
            if (response.data.status === 'completed') {
              // Remove the task from the store
              removeTask(task.id);
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
