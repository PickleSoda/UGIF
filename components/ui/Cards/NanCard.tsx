import Card from './Card';
import { IonIcon, IonSpinner } from '@ionic/react';
import { person } from 'ionicons/icons';
const GifCard = ({ spinner = false }: { spinner: boolean }) => (
  <Card className="my-4 mx-auto w-full rounded-lg">
    <div className="h-40 w-full relative py-4 text-gray-700 rounded-lg flex items-center justify-center">
      {spinner ? (
        <IonSpinner className="object-cover  rounded-lg" />
      ) : (
        <IonIcon
          icon={person}
          className="object-cover h-10 w-10 rounded-lg"
        />
      )}
    </div>
  </Card>
);
export default GifCard;
