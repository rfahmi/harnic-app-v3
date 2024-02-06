import {Toast} from 'react-native-toast-notifications';

const HarnicToast = {
  Show: ({title, position}) => {
    Toast.show(title, {
      type: 'normal',
      placement: position === 'bottom' ? 'bottom' : 'top',
    });
  },
};

export default HarnicToast;
