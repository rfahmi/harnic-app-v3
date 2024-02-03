import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import React, {useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {RNToasty} from '@wu_rong_tai/react-native-toasty';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';
import ReviewItem from './ReviewItem';

const TransactionReview = ({navigation, route}) => {
  const {trxno, items} = route.params;
  const [loading, setLoading] = useState(false);
  const sendReview = async (item, rating, comment) => {
    console.log(item, rating, comment);
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .post(
        `/user/${user_data.user_id}/transaction/${trxno}/review/items/${item}`,
        qs.stringify({rating, comment}),
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          RNToasty.Show({
            title: res.data.message,
            position: 'bottom',
          });
        } else {
          setLoading(false);
          RNToasty.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        setLoading(false);

        console.log(err);
        RNToasty.Show({
          title: err.message,
          position: 'center',
        });
      });
  };
  return (
    <>
      <HeaderBack title="Beri Ulasan" search={false} />
      <ScrollView
        style={{backgroundColor: '#fff'}}
        refreshControl={<RefreshControl refreshing={loading} />}>
        {items.map(i => (
          <ReviewItem
            item={i}
            send={(item, rating, comment) =>
              sendReview(item.itemid, rating, comment)
            }
          />
        ))}
      </ScrollView>
    </>
  );
};

export default TransactionReview;
