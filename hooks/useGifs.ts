import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HomeItem } from '../mock';
import Store from '../store';

const useGifs = (initialPage = 1, perPage = 10) => {
  const loadedGifs = Store.useState(s => s.homeItems);
  const [homeItems, setHomeItems] = useState<HomeItem[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const fetchGifs = useCallback(async () => {
    try {
      const data = { page: page, per_page: perPage };
      console.log('Data:', data);
      const response = await axios.post(
        'https://gifs.unclothed.com/gifs/fetch',
        data,
      );
      console.log(response.data);
      Store.update(s => {
        s.homeItems = [...loadedGifs, ...response.data.gifs];
      });
      setPage(page + 1);
      console.log('Page:', page);
      setHomeItems(loadedGifs);
    } catch (error) {
      console.error('Failed to fetch GIFs:', error);
    }
  }, [loadedGifs, setHomeItems, page, perPage]);

  useEffect(() => {
    loadedGifs.length === 0 ? fetchGifs() : setHomeItems(loadedGifs);
  }, [loadedGifs, fetchGifs]);

  const handleInput = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    homeItems &&
      setHomeItems(
        loadedGifs.filter(d => d.id.toLowerCase().indexOf(query) > -1),
      );
  };
  return {
    handleInput,
    homeItems,
    fetchGifs,
    hasMore,
    reset: () => setPage(1),
  };
};

export default useGifs;
