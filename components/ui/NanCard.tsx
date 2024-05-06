import Card from '../ui/Card';
import { IonIcon, IonSpinner } from '@ionic/react';
import { person } from 'ionicons/icons';
const GifCard = ({ spinner = false }: { spinner: boolean }) => (
  <Card className="my-4 mx-auto w-full">
    <div className="h-64 w-full relative">
      {spinner ? (
        <IonSpinner className="object-cover min-w-full min-h-full max-w-full max-h-full" />
      ) : (
        <IonIcon
          icon={person}
          className="object-cover min-w-full min-h-full max-w-full max-h-full"
        />
      )}
    </div>
    <div></div>
  </Card>
);
export default GifCard;
