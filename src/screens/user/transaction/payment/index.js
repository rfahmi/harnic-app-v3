import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {memo, useEffect, useState} from 'react';
import {View, Alert, Text} from 'react-native';
import {Divider, List, Title} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import HeaderBack from '../../../../components/HeaderBack';
import {api} from '../../../../configs/api';
import ListSkeleton from '../../../../organism/skeleton/ListSkeleton';

const Payment = ({navigation, route}) => {
  const {trx} = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const unfulfilled = trx && trx?.items.filter(a => a.qty < a.qorder);

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
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const rollbackTrx = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .post(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/rollback`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .catch(err => {
        setLoading(false);

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
      navigation.addListener('beforeRemove', e => {
        console.log(route.params.fromStack);
        if (e.data.action.type !== 'GO_BACK') {
          // If not go back action
          return;
        }
        if (route.params.fromStack) {
          // If navigate from transactionstack
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
              onPress: () => {
                rollbackTrx();
                navigation.dispatch(e.data.action);
              },
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
        <>
          {unfulfilled.length > 0 && (
            <View
              style={{
                padding: 8,
                margin: 16,
                borderRadius: 8,
                backgroundColor: '#FFFF88',
              }}>
              <Text
                style={{fontWeight: 'bold', color: '#333', marginBottom: 4}}>
                {unfulfilled.length} Produk tidak terpenuhi!
              </Text>
              {unfulfilled.map(u => (
                <Text style={{fontSize: 10, color: '#333'}}>
                  {u.online_name} -- Kurang {u.qorder - u.qty} pcs
                </Text>
              ))}
            </View>
          )}
          {data.map(i => (
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
          ))}
        </>
      )}
    </View>
  );
};

export default memo(Payment);
