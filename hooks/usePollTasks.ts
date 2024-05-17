// usePollTasks.js
import { useEffect } from 'react';
import axios from 'axios'; // Import your store and actions
import Store  from '../store';
import { updateGif, removeTask, updateVideo } from '../store/actions';
import { request } from '../lib/axios';
const usePollTasks = () => {
  useEffect(() => {
    const pollTasks = () => {
      // Accessing the current tasks directly from the store
      const currentTasks = Store.getRawState()?.tasks;
      if (!currentTasks) return;
      currentTasks.forEach(task => {
        console.log('Polling task:', task);
        request({
          url: '/videos/get',
          method: 'post',
          data: {
            task_id: task.id,
          },
        })
          .then(response => {
            // Handle the response
            console.log('Task response:', response.data);
            if (response.data.status === 'completed') {
              // Remove the task from the store
              removeTask(task.id);~
              updateGif(task.id, 'completed', response.data.src);
              updateVideo(task.id, 'completed', response.data.src);
            }
          })
          .catch(error => {
            console.error('Request error:', error);
            if (error.response.status === 403) {
              removeTask(task.id);
              updateGif(task.id, 'failed', '');
              updateVideo(task.id, 'failed', '');
            }
          });
      });
    };

    const interval = setInterval(pollTasks, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // This hook does not return anything because it solely handles background tasks
};

export default usePollTasks;
