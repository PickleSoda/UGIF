import {
  IonPage,
  IonHeader,
  IonContent,
  IonSearchbar,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonToolbar,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import React, { useRef, useState, useEffect } from 'react';
import Gifs from './Gifs';
import Videos from './Videos';
import { home, heart, pin, star, call, globe, basket, barbell, trash, person, chevronBack, chevronForward } from 'ionicons/icons';
import Store from '../../../store';

const Home = () => {
  const [selectedSegment, setSelectedSegment] = useState('GIF');
  const [selectedSegmentCategory, setSelectedSegmentCategory] = useState('');
  const segmentRef = useRef<HTMLIonSegmentElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const [lastTouchMove, setLastTouchMove] = useState(0);
  const categories = Store.useState(s => [{
    id: 'all-gifs',
    name: 'All',
    category: 'gif'
  }, {
    id: 'all-videos',
    name: 'All',
    category: 'video'
  }, ...s.categories]);

  useEffect(() => {
    const defaultCategory = categories.find(category => 
      category.category === (selectedSegment === 'GIF' ? 'gif' : 'video') && category.name === 'All'
    );
    setSelectedSegmentCategory(defaultCategory ? defaultCategory.id : '');
  }, [selectedSegment, categories]);  


  const handleScrollLeft = () => {
    if (segmentRef.current) {
      segmentRef.current.scrollLeft -= 100;
    }
  };

  const handleScrollRight = () => {
    if (segmentRef.current) {
      segmentRef.current.scrollLeft += 100;
    }
  };

  const onTouchStart = (e: any) => {
    const touch = e.touches[0];
    setIsDragging(true);
    startXRef.current = touch.clientX;
    startScrollLeftRef.current = segmentRef.current ? segmentRef.current.scrollLeft : 0;
  };
  
  const onTouchMove = (e: any) => {
    if (!isDragging) return;
    const now = Date.now();
    if (now - lastTouchMove < 50) return;
    setLastTouchMove(now);
  
    const touch = e.touches[0];
    e.preventDefault();
    const x = touch.clientX;
    const walk = (x - startXRef.current);
    if (segmentRef.current) {
      let newScrollPosition = startScrollLeftRef.current - walk;
      newScrollPosition = Math.max(0, newScrollPosition);
      const maxScrollLeft = segmentRef.current.scrollWidth - segmentRef.current.clientWidth;
      newScrollPosition = Math.min(maxScrollLeft, newScrollPosition);
      segmentRef.current.scrollLeft = newScrollPosition;
    }
  };
  
  
  const onTouchEnd = () => {
    setIsDragging(false);
  };


  return (
    <IonPage className='bg-color'>
      <IonHeader mode='ios' className='container'>
        <IonToolbar className="custom-toolbar p-2 mt-2">
          <IonSegment
            style={{ width: '100%' }}
            mode="ios"
            className='video-gif'
            value={selectedSegment}
            onIonChange={ev => {
              ev.detail.value && setSelectedSegment(ev.detail.value.toString());
              console.log(selectedSegment);
            }}
          >
            <IonSegmentButton mode="ios" value="GIF" className='video-gif-button'>
              <IonLabel>GIF</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton mode="ios" value="Video" className='video-gif-button'>
              <IonLabel>Video</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        <IonToolbar className="custom-toolbar p-2 mt-2">
          <IonButton fill="clear" onClick={handleScrollLeft}>
            <IonIcon icon={chevronBack} />
          </IonButton>
          <IonSegment scrollable={true} ref={segmentRef} value={selectedSegmentCategory} className="scroll-hide"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onIonChange={ev => setSelectedSegmentCategory(ev.detail.value?.toString() ?? '')}>
            {categories.filter(cat => cat.category === (selectedSegment === 'GIF' ? 'gif' : 'video')).map(cat => (
              <IonSegmentButton key={cat.id} value={cat.id}>
                <IonLabel>{cat.name}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
          <IonButton fill="clear" onClick={handleScrollRight}>
            <IonIcon icon={chevronForward} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className='bg-color'>
        <div>
          {selectedSegment === 'GIF' ? (
            <div>
              <Gifs />
            </div>
          ) : (
            <div>
              <Videos />
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;