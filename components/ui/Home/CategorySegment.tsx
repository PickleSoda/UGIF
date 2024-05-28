import {
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import React, { useRef, useState } from 'react';

interface CategorySegmentProps {
  categories: { id: string; name: string }[];
  onSegmentChange: (value: string) => void;
}

const CategorySegment: React.FC<CategorySegmentProps> = ({
  categories,
  onSegmentChange,
}) => {
  const [selectedSegmentCategory, setSelectedSegmentCategory] = useState('');
  const segmentRef = useRef<HTMLIonSegmentElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchMove, setLastTouchMove] = useState(0);
  const startScrollLeftRef = useRef(0);
  const startXRef = useRef(0);

  const onTouchStart = (e: React.TouchEvent<HTMLIonSegmentElement>) => {
    const touch = e.touches[0];
    setIsDragging(true);
    startXRef.current = touch.clientX;
    startScrollLeftRef.current = segmentRef.current
      ? segmentRef.current.scrollLeft
      : 0;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLIonSegmentElement>) => {
    if (!isDragging) return;
    const now = Date.now();
    if (now - lastTouchMove < 50) return;
    setLastTouchMove(now);

    const touch = e.touches[0];
    e.preventDefault();
    const x = touch.clientX;
    const walk = x - startXRef.current;
    if (segmentRef.current) {
      let newScrollPosition = startScrollLeftRef.current - walk;
      newScrollPosition = Math.max(0, newScrollPosition);
      const maxScrollLeft =
        segmentRef.current.scrollWidth - segmentRef.current.clientWidth;
      newScrollPosition = Math.min(maxScrollLeft, newScrollPosition);
      segmentRef.current.scrollLeft = newScrollPosition;
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
  };

  const handleSegmentChange = (value: string) => {
    setSelectedSegmentCategory(value);
    onSegmentChange(value);
  };

  return (
    <div className="custom-toolbar p-2">
      <IonSegment
        scrollable={true}
        ref={segmentRef}
        value={selectedSegmentCategory || categories[0].id}
        className="scroll-hide"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onIonChange={ev =>
          handleSegmentChange(ev.detail.value?.toString() ?? '')
        }
        mode="ios"
      >
        {categories.map(cat => (
          <IonSegmentButton key={cat.id} value={cat.id}>
            <IonLabel>{cat.name}</IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>
    </div>
  );
};

export default CategorySegment;
