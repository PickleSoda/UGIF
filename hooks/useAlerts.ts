import { useIonAlert } from '@ionic/react';
import { request } from '../lib/axios';
import { Browser } from '@capacitor/browser';
import { logoutUser } from '../store/actions';

const useAlerts = () => {
  const [presentAlert] = useIonAlert();

  const showPaymentAlert = async () => {
    await presentAlert({
      header: 'Buy Credits',
      subHeader: 'A Sub Header Is Optional',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
        {
          text: 'Buy',
          handler: async (selectedValue: number) => {
            try {
              const { data } = await request({
                url: '/payment/create_invoice',
                method: 'post',
                data: { amount: selectedValue },
              });
              if (data.status === 200) {
                await Browser.open({ url: data.link });
              }
            } catch (error) {
              console.error(error);
              await Browser.open({
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Easter egg or error handling page
              });
            }
          },
        },
      ],
      inputs: [
        { label: '4.99 - 5 Credits', type: 'radio', value: 5 },
        { label: '14.99 - 20 Credits', type: 'radio', value: 20 },
        { label: '29.99 - 50 Credits', type: 'radio', value: 50 },
        { label: '49.99 - 100 Credits', type: 'radio', value: 100 },
        { label: '99.99 - 200 Credits', type: 'radio', value: 200 },
        { label: '399.99 - 1000 Credits', type: 'radio', value: 1000 },
        { label: '499.99 - 2500 Credits', type: 'radio', value: 2500 },
      ],
    });
  };

  const showErrorAlert = async () => {
    await presentAlert({
      header: 'Error!',
      subHeader: 'Something went wrong.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Alert canceled'),
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => console.log('Alert confirmed'),
        },
      ],
    });
  };
  const showLogoutAlert = async () => {
    presentAlert({
        header: 'Log Out',
        buttons: [
          {
            text: 'Cancel',
            htmlAttributes: {
              'aria-label': 'close',
            },
          },
          {
            text: 'Log Out',
            htmlAttributes: {
              'aria-label': 'logout',
            },
            handler: () => {
              logoutUser();
            },
          },
        ],
      });
    };

  return { showPaymentAlert, showErrorAlert,showLogoutAlert };
};

export default useAlerts;
