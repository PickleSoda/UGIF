import Card from './Card';
import { IonIcon, IonSpinner } from '@ionic/react';
import { person } from 'ionicons/icons';
const GifCard = ({ spinner = false }: { spinner: boolean }) => (
  <Card className="my-4 mx-auto w-full rounded-lg">
    <div className="h-56 w-full relative py-40 text-gray-700 rounded-lg">
      {spinner ? (
        <IonSpinner className="object-cover  rounded-lg" />
      ) : (
        <IonIcon
          icon={person}
          className="object-cover min-w-full min-h-full max-w-full max-h-full rounded-lg"
        />
      )}
    </div>
  </Card>
);
export default GifCard;
