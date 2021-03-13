import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import qs from 'qs';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Card, Dialog, Paragraph} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import * as assets from '../../../../assets/images/banks';
import {FacebookWebView} from '../../../../components/FacebookWebView';
import HeaderBack from '../../../../components/HeaderBack';
import {api} from '../../../../configs/api';
import {colors} from '../../../../constants/colors';

const PaymentDW = ({trx}) => {
  const navigation = useNavigation();
  const webviewModal = useRef(null);
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [alert, setAlert] = useState(false);

  const [data, setData] = useState(null);
  const _handleAlert = (bank) => {
    setChannel(bank);
    setAlert(true);
  };
  const _confirm = async (dw_code) => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .post(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/dw`,
        qs.stringify({
          channel: dw_code,
        }),
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        setAlert(false);
        setLoading(false);
        if (res.data.success) {
          console.log(res.data.data);
          setPaymentUrl(res.data.data);
          webviewModal.current?.open();
        } else {
          console.log('success false', res.data);
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch((err) => {
        console.log('catch');
        setAlert(false);
        setLoading(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const getData = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/dw/channels`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.data);
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
    <>
      <HeaderBack title="Digital Wallet" search={false} />

      <FlatList
        data={data}
        numColumns={2}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => _handleAlert(item)}>
            <Card
              style={{
                flex: 1,
                margin: 8,
                padding: 16,
                alignItems: 'center',
                elevation: 1,
              }}>
              <Image source={assets[item.img.replace('.jpg', '')]} />
            </Card>
          </TouchableOpacity>
        )}
      />
      <Dialog visible={alert} onDismiss={() => setAlert(false)}>
        <Dialog.Title>Perhatian!</Dialog.Title>
        <Dialog.Content>
          {loading ? (
            <View
              style={{
                // height: WINDOW_HEIGHT * 0.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <Paragraph>{`Anda memilih pembayaran dengan menggunakan ${
              channel && channel.dw_name
            }, metode pembayaran tidak dapat diubah setelah lanjut`}</Paragraph>
          )}
        </Dialog.Content>
        {!loading && (
          <Dialog.Actions>
            <Button onPress={() => setAlert(false)} color={colors.red}>
              Batal
            </Button>
            <Button onPress={() => _confirm(channel && channel.dw_code)}>
              Lanjutkan
            </Button>
          </Dialog.Actions>
        )}
      </Dialog>
      {paymentUrl && (
        <FacebookWebView
          ref={webviewModal}
          uri={paymentUrl}
          onClose={() =>
            navigation.replace('TransactionView', {trxno: trx.trxno})
          }
        />
      )}
    </>
  );
};

export default memo(PaymentDW);
