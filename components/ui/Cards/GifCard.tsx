import Image from 'next/image';
import Card from './Card';
import { useEffect, useState } from 'react';
import { generateRandomColor } from '../../../mock';
import CapImageCacheComponent from '../../../utils/cache/CapacitorCacheComponent';
type FeedCardProps = {
  src: string;
  className: string;
};

const GifCard = ({ src, className }: FeedCardProps) => {

  return (
    <Card className={className+' rounded-lg h-full'}>
          <CapImageCacheComponent src={src} lazy={false}/>
        {/* <Image
          className="object-contain w-full rounded-lg"
          src={src}
          alt={src}
          width={100}
          height={100}
          style={{ backgroundColor }}
          loading="eager" 
        /> */}
    </Card>
  );
};

export default GifCard;
