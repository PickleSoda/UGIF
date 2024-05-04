import Image from 'next/image';
import Card from '../ui/Card';
type FeedCardProps = {
  src: string;
};
const GifCard = ({  src }: FeedCardProps) => (
  <Card className="my-4 mx-auto w-full">
      <div className="h-64 w-full relative">
        <Image
          className="object-cover min-w-full min-h-full max-w-full max-h-full"
          src={src}
          alt=""
          fill
        />
      </div>
    <div >
    </div>
  </Card>
);

export default GifCard;
