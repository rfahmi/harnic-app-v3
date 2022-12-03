import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Button, Card, Chip, Text, Title} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';
import {colors} from '../../../constants/colors';
import {currencyFormat} from '../../../utils/formatter';

const BillingView = ({navigation, route}) => {
  const {billing} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getData = async (trxno) => {
    console.log(`/user/${billing.user_id}/billing/${trxno}`);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(`/user/${user_data.user_id}/billing/${trxno}`, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
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
        console.log('false');

        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const _handleRefresh = () => {
    setData(null);
    setLoading(true);
    getData(billing.trxno)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    getData(billing.trxno)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  const getIcon = (num) => {
    const res =
      num == 0
        ? 'progress-alert'
        : num === 1
        ? 'progress-clock'
        : num === 2
        ? 'progress-check'
        : num === 3
        ? 'check'
        : num === 4
        ? 'check-all'
        : 'error-outline';
    return res;
  };

  return (
    <>
      <HeaderBack title="Billing View" search={false} />
      <ScrollView
        style={{padding: 16}}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }>
        {data && (
          <>
            <Card>
              <Card.Content style={{alignItems: 'flex-start'}}>
                <Title>{`${data.product_desc}`}</Title>
                <Text variant="titleLarge">{data.customer_id}</Text>
                <Chip
                  style={{flex: 1, marginTop: 8}}
                  icon={getIcon(data.status)}
                  onPress={() => console.log('Pressed')}>
                  {data.status_desc}
                </Chip>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'orange',
                    marginTop: 16,
                  }}>{`Total Bayar: Rp ${currencyFormat(
                  Number(data.price),
                )}`}</Text>
              </Card.Content>
            </Card>
            {data.status == 0 ? (
              <Button
                mode="contained"
                style={{marginTop: 32}}
                onPress={() =>
                  navigation.push('BIllingPayment', {
                    screen: 'BillingPayment',
                    params: {
                      trx: data
                    }
                  })
                }>
                BAYAR
              </Button>
            ) : data.status == 1 ? (
              <Button mode="contained" style={{marginTop: 32}}>
                SELESAIKAN PEMBAYARAN
              </Button>
            ) : (
              <Button disabled mode="contained" style={{marginTop: 32}}>
                BAYAR
              </Button>
            )}
            {data.status == 0 && (
              <Button
                mode="contained"
                color={colors.error}
                style={{marginTop: 8}}>
                BATALKAN TRANSAKSI
              </Button>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
};

export default BillingView;
