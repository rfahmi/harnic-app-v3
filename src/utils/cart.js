import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import {RNToasty} from 'react-native-toasty';
import {api} from '../configs/api';

export const addCart = async (item_id, qty, note, toast) => {
  const api_token = await AsyncStorage.getItem('api_token');
  const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

  const result = await api
    .post(
      '/user/' + user_data.user_id + '/cart',
      qs.stringify({item_id, qty, note, app_version: 30000}),
      {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      },
    )
    .then((res) => {
      if (res.data.success) {
        toast &&
          RNToasty.Success({
            title: res.data.message,
            position: 'center',
          });
        console.log('aaaaaaaaaaaa', res.data);
        return res.data.data;
      } else {
        toast &&
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      }
    })
    .catch((err) => {
      console.log('false');

      RNToasty.Error({
        title: err.message,
        position: 'center',
      });
    });
  return result;
};

export const updateCart = async (item_id, qty, toast) => {
  const api_token = await AsyncStorage.getItem('api_token');
  const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

  const result = await api
    .put(
      '/user/' + user_data.user_id + '/cart/' + item_id,
      qs.stringify({qty}),
      {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      },
    )
    .then((res) => {
      if (res.data.success) {
        toast &&
          RNToasty.Success({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      } else {
        toast &&
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      }
    })
    .catch((err) => {
      console.log('false');

      RNToasty.Error({
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
    .then((res) => {
      if (res.data.success) {
        toast &&
          RNToasty.Success({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      } else {
        toast &&
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        return res.data.data;
      }
    })
    .catch((err) => {
      console.log('false');

      RNToasty.Error({
        title: err.message,
        position: 'center',
      });
    });
  return result;
};
