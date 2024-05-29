import { useState, useEffect, useCallback } from 'react';
import Store from '../store';
import { request } from '../lib/axios';
const useVideos = (initialPage = 1, perPage = 10) => {
  const loadedVids = Store.useState(s => s.videos);
  const [videos, setvideos] = useState<any[]>([]);
  const [page, setPage] = useState((loadedVids.length/perPage)+1);

  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState<string | null>();

  const fetchVideos = useCallback(async () => {
    try {
      if (!hasMore) return;
      const data = { page: page, per_page: perPage };
      if (category) {
        console.log('Data:', data);

        const response = await request({
          url: '/movies/fetch_by_category',
          method: 'post',
          data: { ...data, category: category },
        });
        console.log(response.data);
        Store.update(s => {
          s.videos = [...loadedVids, ...response.data.gifs];
        });
        if (response.data.gifs.length === 0) {
          setHasMore(false);
        }
      } else {
        console.log('Data:', data);

        const response = await request({
          url: '/movies/fetch',
          method: 'post',
          data: data,
        });
        console.log(response.data);
        Store.update(s => {
          s.videos = [...loadedVids, ...response.data.gifs];
        });
        if (response.data.gifs.length === 0) {
          setHasMore(false);
        }
      }
      setPage(page + 1);
      console.log('Page:', page);
      setvideos(loadedVids);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    }
  }, [loadedVids, setvideos, page, perPage, category, hasMore]);

  useEffect(() => {
    loadedVids.length === 0 ? fetchVideos() : setvideos(loadedVids);
  }, [loadedVids, fetchVideos]);

  const handleInput = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    videos &&
      setvideos(loadedVids.filter(d => d.id.toLowerCase().indexOf(query) > -1));
  };
  const handleRefresh = (event?: CustomEvent) => {
    setHasMore(true);
    setPage(1);
    setvideos([]);
    Store.update(s => {
      s.videos = [];
    });
    if (event) {
      setTimeout(() => {
        // Any calls to load data go here
        event.detail.complete();
      }, 1000);
      console.log('refreshed:');
    }
    console.log('refreshed:');
  };
  const handleCategotyChange = (category: string | null) => {
    setCategory(category);
    handleRefresh();
  };
  return {
    handleRefresh,
    handleInput,
    videos,
    fetchVideos,
    hasMore,
    handleCategotyChange,
    reset: () => setPage(1),
  };
};

export default useVideos;
