import Image from 'next/image';
import Card from '../ui/Card';
type FeedCardProps = {
  src: string;
};
const GifCard = ({ src }: FeedCardProps) => (
  <Card className="my-4 mx-auto px-2">
    <div className="relative max-h-96 overflow-hidden">
      <Image
        className="object-cover w-full"
        src={src}
        alt={src}
        width={100}
        height={100}
        style={{ backgroundColor: 'var(--ion-background-color, #fff)' }}
      />
    </div>
    <div></div>
  </Card>
);

export default GifCard;
