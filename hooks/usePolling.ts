import { useState, useEffect } from 'react';
import axios from 'axios';

const usePolling = (url:string, interval = 5000) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const poll = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url);
                if (response.data && response.data.complete) {
                    setData(response.data);
                    setLoading(false);
                } else {
                    setTimeout(poll, interval);
                }
            } catch (err: any) {
                setError(err);
                setLoading(false);
            }
        };

        poll();

        return () => {
            setLoading(false); // Cleanup if the component is unmounted
        };
    }, [url, interval]);

    return { data, loading, error };
};

export default usePolling;
