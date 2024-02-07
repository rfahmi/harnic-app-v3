import {PureComponent} from 'react';
import {Toast} from 'react-native-toast-notifications';

class HarnicToast extends PureComponent {
  static lastToast = null;
  static lastToastTime = null;
  static timeout = 3000; // time interval in milliseconds

  static Show({title, position}) {
    const currentTime = new Date().getTime();
    const toastPayload = JSON.stringify({title, position});

    if (
      HarnicToast.lastToast !== toastPayload ||
      !HarnicToast.lastToastTime ||
      currentTime - HarnicToast.lastToastTime > HarnicToast.timeout
    ) {
      Toast.show(title, {
        type: 'normal',
        placement: position === 'bottom' ? 'bottom' : 'top',
      });
      HarnicToast.lastToast = toastPayload;
      HarnicToast.lastToastTime = currentTime;
    }
  }
}

export default HarnicToast;
