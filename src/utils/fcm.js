import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import {api} from '../configs/api';

export const saveFcm = async (push_notification_token) => {
  const api_token = await AsyncStorage.getItem('api_token');
  const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

  return (
    user_data &&
    (await api.put(
      '/user/' + user_data.user_id + '',
      qs.stringify({push_notification_token}),
      {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      },
    ))
  );
};
export const deleteFcm = async () => {
  const api_token = await AsyncStorage.getItem('api_token');
  const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
  return (
    user_data &&
    (await api.put(
      '/user/' + user_data.user_id + '',
      qs.stringify({push_notification_token: 'x'}),
      {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      },
    ))
  );
};
