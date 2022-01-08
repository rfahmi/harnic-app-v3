import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import qs from 'qs';
import React, {memo, useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {Button, Switch} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import {api} from '../configs/api';
import {colors} from '../constants/colors';
import {currencyFormat} from '../utils/formatter';

const FooterCheckout = ({
  product,
  shipping,
  expedition,
  type,
  time,
  voucher,
  note,
  disabled,
  point = 0,
  usePoint = false,
  usePointChanged,
  showPoint = false,
}) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const delivery_fee = type ? type.fee : 0;
  const discount_value = voucher ? voucher.DiscValue : 0;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (usePoint) {
      setTotal(product + delivery_fee - discount_value - point);
    } else {
      console.log('nopoint', discount_value);
      setTotal(product + delivery_fee - discount_value);
    }
  }, [usePoint, discount_value, product, delivery_fee, point]);

  const _handleCheckout = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .post(
        '/user/' + user_data.user_id + '/transaction',
        qs.stringify({
          shipping_id: shipping ? shipping.shipping_id : 0,
          expedition_id: expedition ? expedition.id : 0,
          type_id: type ? type.id : 0,
          time_id: time ? time.id : null,
          vc_code: voucher ? voucher.code : null,
          note: note,
          use_point: usePoint ? point : null,
        }),
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          navigation.replace('Transaction', {
            screen: 'Payment',
            params: {
              screen: 'Payment',
              params: {
                trx: res.data.data,
                fromStack: false,
              },
            },
          });
          RNToasty.Success({
            title: res.data.message,
            position: 'bottom',
          });
        } else {
          RNToasty.Warn({
            title: res.data.message,
            position: 'bottom',
          });
          navigation.replace('App', {
            screen: 'Cart',
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  return (
    <View
      style={{
        zIndex: 1,
        borderTopColor: '#ccc',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
        padding: 16,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderColor: '#aaa',
          borderBottomWidth: 0.5,
          borderStyle: 'dashed',
          paddingVertical: 8,
        }}>
        <Text style={{color: 'black', fontSize: 14}}>Total Barang</Text>
        <Text style={{fontSize: 14, fontWeight: 'bold', color: '#333'}}>
          Rp{currencyFormat(product)} {console.log(usePoint)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderColor: '#aaa',
          borderBottomWidth: 0.5,
          borderStyle: 'dashed',
          paddingVertical: 8,
        }}>
        <Text style={{color: 'black', fontSize: 14}}>Ongkir</Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: delivery_fee ? '#333' : 'green',
          }}>
          {delivery_fee ? `Rp${currencyFormat(delivery_fee)}` : 'Gratis'}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderColor: '#aaa',
          borderBottomWidth: 0.5,
          borderStyle: 'dashed',
          paddingVertical: 8,
        }}>
        <Text style={{color: 'black', fontSize: 14}}>Diskon</Text>
        <Text style={{fontSize: 14, fontWeight: 'bold', color: '#333'}}>
          Rp{currencyFormat(discount_value)}
        </Text>
      </View>
      {showPoint && point > 0 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderColor: '#aaa',
            borderBottomWidth: 0.5,
            borderStyle: 'dashed',
            paddingVertical: 8,
          }}>
          <Text style={{color: 'black', fontSize: 14}}>
            Gunakan {point} Point?
          </Text>
          <Switch value={usePoint} onValueChange={usePointChanged} />
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderColor: '#aaa',
          borderBottomWidth: 0.5,
          borderStyle: 'dashed',
          paddingVertical: 8,
        }}>
        <Text style={{color: 'black', fontSize: 12}}>TOTAL</Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'orange'}}>
          Rp{currencyFormat(total)}
        </Text>
      </View>
      <Button
        disabled={disabled || loading}
        onPress={() => {
          Alert.alert(
            'Yakin sudah semua?',
            'Produk tidak dapat diubah dan keranjang akan dibersihkan setelah lanjut',
            [
              {
                text: 'Batal',
                style: 'destructive',
                onPress: () => {},
              },
              {
                text: 'Lanjut dan Bayar',
                onPress: () => _handleCheckout(),
              },
            ],
          );
        }}
        style={{width: '100%', marginVertical: 10, zIndex: 0}}
        labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
        color={colors.green}
        mode="contained">
        {loading ? 'Loading...' : 'Lanjutkan'}
      </Button>
    </View>
  );
};

export default memo(FooterCheckout);
