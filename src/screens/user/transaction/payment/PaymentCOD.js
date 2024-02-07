import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import qs from 'qs';
import React, {memo, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, Card, TextInput} from 'react-native-paper';
import HarnicToast from '@components/HarnicToast';
import HeaderBack from '../../../../components/HeaderBack';
import {api} from '../../../../configs/api';
import {currencyFormat} from '../../../../utils/formatter';

const PaymentCOD = ({trx}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [cod_cash, setCodCash] = useState(0);
  const pay = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    console.log(
      `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/tf`,
    );
    await api
      .post(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/cod`,
        qs.stringify({cod_cash}),
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          navigation.replace('Transaction', {
            screen: 'TransactionView',
            params: {trxno: trx.trxno},
          });
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        } else {
          setLoading(false);
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        setLoading(false);

        console.log(err);
        HarnicToast.Show({
          title: err.message,
          position: 'center',
        });
      });
  };
  return (
    <>
      <HeaderBack title="Cash On Delivery" search={false} />
      <ScrollView>
        <Card
          style={{
            margin: 16,
            padding: 16,
            justifyContent: 'center',
            elevation: 1,
          }}>
          <Text style={{textAlign: 'center'}}>
            Pastikan nomor penerima berikut selalu aktif:
          </Text>
          <Text style={{textAlign: 'center', marginTop: 16}}>
            {trx.shipping.pic_name}
          </Text>
          <Text style={{textAlign: 'center', fontSize: 24, fontWeight: 'bold'}}>
            {trx.shipping.pic_phone}
          </Text>
          <Text style={{textAlign: 'center', marginTop: 16}}>
            Nominal yang harus dibayar:
          </Text>
          <Text style={{textAlign: 'center', fontSize: 24, fontWeight: 'bold'}}>
            Rp{currencyFormat(trx.total)}
          </Text>
        </Card>
        <Card
          style={{
            margin: 16,
            padding: 16,
            elevation: 1,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
            }}>
            Perlu Kembalian?
          </Text>
          <Text style={{textAlign: 'center', marginVertical: 6}}>
            Masukkan nominal uang yang tersedia (Opsional)
          </Text>
          <View style={{backgroundColor: 'yellow'}}>
            <TextInput
              mode="flat"
              value={cod_cash}
              onChangeText={text => setCodCash(text)}
            />
          </View>
        </Card>
        <Card
          style={{
            margin: 16,
            padding: 16,
            alignItems: 'center',
            elevation: 1,
            backgroundColor: 'orange',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
            }}>
            Anda tidak perlu membayar biaya tambahan kepada kurir!
          </Text>
          <Text style={{textAlign: 'center'}}>
            Apabila kurir kami meminta biaya tambahan, mohon untuk melaporkan ke
            nomor WhatsApp (0813-1014-1393)
          </Text>
        </Card>
      </ScrollView>
      <View style={{margin: 16, zIndex: 1}}>
        <Button disabled={loading} mode="contained" onPress={() => pay()}>
          OK, Saya Mengerti
        </Button>
      </View>
    </>
  );
};

export default memo(PaymentCOD);
