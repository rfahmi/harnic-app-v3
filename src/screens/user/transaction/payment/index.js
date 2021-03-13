import AsyncStorage from '@react-native-community/async-storage';
import React, {memo, useEffect, useState} from 'react';
import {View, Alert, Text} from 'react-native';
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
    let append_url = user_data && user_data.is_developer === 1 ? '/all' : '';
    await api
      .get(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/method${append_url}`,
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

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type !== 'GO_BACK') {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Keluar halaman ini?',
          'Transaksi ini belum dibayar, anda dapat melanjutkan pembayaran nanti melalui menu User > Transaksi Baru',
          [
            {
              text: 'Keluar',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
            {text: 'Lanjut Bayar', style: 'cancel', onPress: () => {}},
          ],
        );
      }),
    [navigation],
  );

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
              right={() => (
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {Number(i.is_new) === 1 ? (
                    <View
                      style={{
                        backgroundColor: 'orange',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 2,
                      }}>
                      <Text style={{color: '#fff', fontSize: 9}}>New</Text>
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
              )}
            />
            <Divider />
          </React.Fragment>
        ))
      )}
    </View>
  );
};

export default memo(Payment);
