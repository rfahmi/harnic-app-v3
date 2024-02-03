import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import {RNToasty} from '@wu_rong_tai/react-native-toasty';
import {api, app_version} from '../configs/api';

export const addCart = async (item_id, qty, note, toast) => {
  const api_token = await AsyncStorage.getItem('api_token');
  const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

  const result = await api
    .post(
      '/user/' + user_data.user_id + '/cart',
      qs.stringify({item_id, qty, note, app_version}),
      {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      },
    )
    .then(res => {
      if (res.data.success) {
        toast &&
          RNToasty.Show({
            title: res.data.message,
            position: 'center',
          });
        console.log('aaaaaaaaaaaa', res.data);
        return res.data.data;
      } else {
        toast &&
          RNToasty.Show({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      }
    })
    .catch(err => {
      console.log('false');

      RNToasty.Show({
        title: err.message,
        position: 'center',
      });
    });
  return result;
};

export const updateCart = async (item_id, qty, note, toast) => {
  const api_token = await AsyncStorage.getItem('api_token');
  const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
  console.log(qty);

  const result = await api
    .put(
      '/user/' + user_data.user_id + '/cart/' + item_id,
      qs.stringify({qty, note}),
      {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      },
    )
    .then(res => {
      if (res.data.success) {
        toast &&
          RNToasty.Show({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      } else {
        toast &&
          RNToasty.Show({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      }
    })
    .catch(err => {
      console.log('false');

      RNToasty.Show({
        title: err.message,
        position: 'center',
      });
    });
  return result;
};

export const deleteCart = async (item_id, toast) => {
  const api_token = await AsyncStorage.getItem('api_token');
  const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

  const result = await api
    .delete('/user/' + user_data.user_id + '/cart/' + item_id, {
      headers: {
        Authorization: 'Bearer ' + api_token,
      },
    })
    .then(res => {
      if (res.data.success) {
        toast &&
          RNToasty.Show({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      } else {
        toast &&
          RNToasty.Show({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      }
    })
    .catch(err => {
      console.log('false');

      RNToasty.Show({
        title: err.message,
        position: 'center',
      });
    });
  return result;
};
