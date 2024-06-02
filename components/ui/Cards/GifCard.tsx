import Image from 'next/image';
import Card from './Card';
import { useEffect, useState } from 'react';
import { generateRandomColor } from '../../../mock';
import { radio } from 'ionicons/icons';
type FeedCardProps = {
  src: string;
  className: string;
};

const GifCard = ({ src, className }: FeedCardProps) => {
  const [backgroundColor, setBackgroundColor] = useState('#D81159'); // Initial color

  useEffect(() => {
    setBackgroundColor(generateRandomColor()); // Set a random color from the array
  }, [src]); // Change color when the src changes

  return (
    <Card className={className+' rounded-lg'}>
        <Image
          className="object-contain w-full rounded-lg"
          src={src}
          alt={src}
          width={100}
          height={100}
          style={{ backgroundColor }}
        />
    </Card>
  );
};

export default GifCard;
