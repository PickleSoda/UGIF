import Image from 'next/image';
import Card from '../ui/Card';
import { useEffect, useState } from 'react';
import { generateRandomColor } from '../../mock';
type FeedCardProps = {
  src: string;
};

const GifCard = ({ src }: FeedCardProps) => {
  const [backgroundColor, setBackgroundColor] = useState('green'); // Initial color

  useEffect(() => {
    setBackgroundColor(generateRandomColor()); // Set a random color from the array
  }, [src]); // Change color when the src changes

  return (
    <Card className="p-1 rounded-lg">
      <div className="relative overflow-hidden">
        <Image
          className="object-cover w-full rounded-lg"
          src={src}
          alt={src}
          width={100}
          height={100}
          style={{ backgroundColor }} // Use the state variable here
        />
      </div>
      <div></div>
    </Card>
  );
};

export default GifCard;
