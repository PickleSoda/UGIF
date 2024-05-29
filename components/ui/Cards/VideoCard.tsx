import Image from 'next/image';
import Card from './Card';
import { useEffect, useState } from 'react';
import { generateRandomColor } from '../../../mock';
import {
  Player,
  BigPlayButton,
  ControlBar,
  PlayToggle,
  VolumeMenuButton,
} from 'video-react';
type FeedCardProps = {
  src: string;
  className?: string;
  autoPlay?: boolean;
};

const VideoCard = ({ src, autoPlay = false, className }: FeedCardProps) => {
  const [backgroundColor, setBackgroundColor] = useState('green'); // Initial color

  useEffect(() => {
    setBackgroundColor(generateRandomColor()); // Set a random color from the array
  }, [src]); // Change color when the src changes

  return (
    <Card className={`${className} rounded-full`}>
      <div className="relative overflow-hidden">
        <Player
          preload="metadata"
          playsInline
          src={src + '#t=1'}
          autoPlay={autoPlay}
        >
          <BigPlayButton className="big-play-button-hide" />
          <ControlBar
            autoHide={false}
            disableDefaultControls={true}
            className="bg-opacity-0"
          >
            <PlayToggle />
            <VolumeMenuButton vertical />
          </ControlBar>
        </Player>
      </div>
      <div></div>
    </Card>
  );
};

export default VideoCard;
