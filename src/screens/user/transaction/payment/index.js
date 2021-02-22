import AsyncStorage from '@react-native-community/async-storage';
import React, {memo, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Divider, List} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import HeaderBack from '../../../../components/HeaderBack';
import {api} from '../../../../configs/api';
import ListSkeleton from '../../../../organism/skeleton/ListSkeleton';

const Payment = ({navigation, route}) => {
  const {trx} = route.params;
  const [data, setData] = useState(null);
  const getData = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/method`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch((err) => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={{backgroundColor: '#fff'}}>
      <HeaderBack title="Metode Pembayaran" search={false} />
      {!data ? (
        <ListSkeleton />
      ) : (
        data.map((i) => (
          <React.Fragment key={i.payment_code}>
            <List.Item
              title={i.payment_name}
              onPress={() =>
                navigation.replace('Pay', {code: i.payment_code, trx})
              }
            />
            <Divider />
          </React.Fragment>
        ))
      )}
    </View>
  );
};

export default memo(Payment);
