import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HomeItem } from '../mock';
import Store from '../store';
import { request } from '../lib/axios';
const useGifs = (initialPage = 1, perPage = 10) => {
  const loadedGifs = Store.useState(s => s.gifs);
  const [gifs, setgifs] = useState<HomeItem[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const fetchGifs = useCallback(async () => {
    try {
      const data = { page: page, per_page: perPage };
      console.log('Data:', data);

      const response = await request({
        url: '/gifs/fetch',
        method: 'post',
        data: data,
      });
      console.log(response.data);
      Store.update(s => {
        s.gifs = [...loadedGifs, ...response.data.gifs];
      });
      setPage(page + 1);
      console.log('Page:', page);
      setgifs(loadedGifs);
    } catch (error) {
      console.error('Failed to fetch GIFs:', error);
    }
  }, [loadedGifs, setgifs, page, perPage]);

  useEffect(() => {
    loadedGifs.length === 0 ? fetchGifs() : setgifs(loadedGifs);
  }, [loadedGifs, fetchGifs]);

  const handleInput = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    gifs &&
      setgifs(loadedGifs.filter(d => d.id.toLowerCase().indexOf(query) > -1));
  };
  const handleRefresh = (event: CustomEvent) => {
    setHasMore(true);
    setPage(1);
    setgifs([]);
    Store.update(s => {
      s.gifs = [];
    });
    setTimeout(() => {
      // Any calls to load data go here
      event.detail.complete();
    }, 1000);
    console.log('refreshed:');
  };
  return {
    handleRefresh,
    handleInput,
    gifs,
    fetchGifs,
    hasMore,
    reset: () => setPage(1),
  };
};

export default useGifs;
