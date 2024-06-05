import React, { useEffect, useRef, useState } from 'react';
import { CapImageCacheService, ImageCacheResult } from './capacitorCacheService';
import { IonSkeletonText } from '@ionic/react';
import { generateRandomColor } from '../../mock';

interface CapImageCacheProps {
  src?: string;
  lazy?: boolean;
}

const CapImageCacheComponent: React.FC<CapImageCacheProps> = ({ src, lazy = false }) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [alreadyRendered, setAlreadyRendered] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const [backgroundColor, setBackgroundColor] = useState('#D81159'); // Initial color

  useEffect(() => {
    setBackgroundColor(generateRandomColor()); // Set a random color from the array
  }, [src]); // Change color when the src changes


  const loadImage = async () => {
    if (src) {
      try {
        const result: ImageCacheResult = await CapImageCacheService.getImageSrc(src);
        setImageSrc(result.data);
        console.info(src, 'Loaded successfully from', result.from);
      } catch (error) {
        console.error('Cannot load image. Check your URL.', error);
      }
    } else {
      console.error('Image src URL is not set');
    }
  };

  const startObserving = () => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          renderContents(entry.isIntersecting);
        });
      },
      { threshold: [0, 0.1, 0.9, 1] }
    );

    if (elementRef.current) {
      observer.current.observe(elementRef.current);
    }
  };

  const renderContents = (isInView: boolean) => {
    if (isInView && !alreadyRendered) {
      setAlreadyRendered(true);
      if (observer.current) {
        observer.current.disconnect();
      }
      loadImage();
    }
  };

  useEffect(() => {
    if (lazy) {
      startObserving();
    } else {
      loadImage();
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [src, lazy]);

  return (
    <div ref={elementRef} className='h-full rounded-lg' >
      {imageSrc ? <img src={imageSrc} alt="cached" /> :
        <IonSkeletonText animated={true} style={{ backgroundColor, width: '100%' }} />
      }
    </div>
  );
};

export default CapImageCacheComponent;
