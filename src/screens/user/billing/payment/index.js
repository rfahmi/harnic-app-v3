import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {memo, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Divider, List} from 'react-native-paper';
import HarnicToast from '@components/HarnicToast';
import HeaderBack from '../../../../components/HeaderBack';
import {api} from '../../../../configs/api';
import ListSkeleton from '../../../../organism/skeleton/ListSkeleton';

const Payment = ({navigation, route}) => {
  const {trx} = route.params;
  console.log(trx);
  const [data, setData] = useState(null);

  const getData = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(`/user/${user_data.user_id}/billing/${trx.trxno}/payment/method`, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        HarnicToast.Show({
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
        <>
          {data.map(i => (
            <React.Fragment key={i.payment_code}>
              <List.Item
                title={i.payment_name}
                onPress={() =>
                  navigation.replace('BillingPay', {code: i.payment_code, trx})
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
