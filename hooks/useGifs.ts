import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HomeItem } from '../mock';
import Store from '../store';
import { request } from '../lib/axios';
const useGifs = (initialPage = 1, perPage = 10) => {
  const loadedGifs = Store.useState(s => s.gifs);
  const [gifs, setgifs] = useState<HomeItem[]>([]);
  const [page, setPage] = useState((loadedGifs.length/perPage)+1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState<string|null>();

  const fetchGifs = useCallback(async (callback?: () => void) => {
    try {
      if(!hasMore) return;
      const data = { page: page, per_page: perPage };
      if(category) {
        console.log('Data:', data);
        
        const response = await request({
          url: '/gifs/fetch_by_category',
          method: 'post',
          data: {...data, category: category},
        });
        console.log(response.data);
        Store.update(s => {
          s.gifs = [...loadedGifs, ...response.data.gifs];
        });
        if(response.data.gifs.length === 0) {
          setHasMore(false);
        }
      }
      else{

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
        if(response.data.gifs.length === 0) {
          setHasMore(false);
        }
      }
      setPage(page + 1);
      console.log('Page:', page);
      setgifs(loadedGifs);
      if (callback) {
        callback();
      }
    } catch (error) {
      console.error('Failed to fetch GIFs:', error);
    }
  }, [loadedGifs, setgifs, page, perPage, category, hasMore]);
  const handleInput = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    gifs &&
      setgifs(loadedGifs.filter(d => d.id.toLowerCase().indexOf(query) > -1));
  };
  const handleCategotyChange = (category:string|null) => {
    setCategory(category);
    handleRefresh();
  };
  const handleRefresh = (event?: CustomEvent) => {
    setHasMore(true);
    setPage(1);
    setgifs([]);
    Store.update(s => {
      s.gifs = [];
    });
    if (event) {
      setTimeout(() => {
        // Any calls to load data go here
        event.detail.complete();
      }, 1000);
      console.log('refreshed:');
    }
  };
  return {
    handleRefresh,
    handleInput,
    gifs,
    fetchGifs,
    hasMore,
    reset: () => setPage(1),
    handleCategotyChange,
  };
};

export default useGifs;
