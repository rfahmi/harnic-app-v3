import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import qs from 'qs';
import React, {memo, useRef, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import {CreditCardInput} from 'react-native-credit-card-input';
import {Button, Checkbox} from 'react-native-paper';
import HarnicToast from '@components/HarnicToast';
import {FacebookWebView} from '../../../../components/FacebookWebView';
import HeaderBack from '../../../../components/HeaderBack';
import {api} from '../../../../configs/api';
import {colors} from '../../../../constants/colors';
import Empty from '../../../../organism/empty';

const PaymentCC = ({trx}) => {
  const navigation = useNavigation();
  const webviewModal = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [card, setCard] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const _confirm = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    const expiry = card.values.expiry.split('/');
    await api
      .post(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/cc`,
        qs.stringify({
          cardholder: card.values.name,
          cardnumber: card.values.number.replace(/ /g, ''),
          mm: expiry[0],
          yy: expiry[1],
          cvv: card.values.cvc,
        }),
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          console.log(res.data.data);
          setPaymentUrl(res.data.data);
          webviewModal.current?.open();
          isSave && saveCard();
        } else {
          console.log(res.data);
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        setLoading(false);
        HarnicToast.Show({
          title: err.message,
          position: 'center',
        });
      });
  };

  const saveCard = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    const expiry = card.values.expiry.split('/');
    return await api.post(
      `/user/${user_data.user_id}/card`,
      qs.stringify({
        card_num: card.values.number.replace(/ /g, ''),
        card_holder: card.values.name,
        card_exp: expiry[0] + expiry[1],
      }),
      {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      },
    );
  };

  return (
    <>
      <HeaderBack title="Kartu Kredit" search={false} />
      <View
        style={{
          backgroundColor: colors.note,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}>
        <Text style={{fontSize: 11}}>
          HARNIC ID hanya menyimpan nomor kartu agar anda (opsional) dapat
          dengan mudah menggunakannya kembali di lain waktu, kami tidak
          menyimpan data nomor CVC anda.
        </Text>
      </View>
      <ScrollView style={{padding: 16, backgroundColor: '#fff'}}>
        {trx.reff_bank ? (
          <View>
            <Empty
              image="card_payment"
              title="Pembayaran Sebelumnya Belum Selesai"
              caption="Silahkan lanjutkan dengan menekan tombol berikut"
            />
            <Button
              onPress={() => {
                const reff = trx.reff_bank.split(';');
                setPaymentUrl(reff[1]);
                webviewModal.current?.open();
              }}
              disabled={loading}
              style={{
                margin: 16,
              }}
              labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
              color={colors.primary}
              loading={loading ? <ActivityIndicator /> : null}
              mode="contained">
              {loading ? 'Memproses Kartu Anda' : 'Lanjutkan Pembayaran'}
            </Button>
          </View>
        ) : (
          <>
            <CreditCardInput
              onChange={e => setCard(e)}
              requiresName
              allowScroll
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: 8,
                marginVertical: 4,
              }}>
              <Text>Simpan kartu untuk nanti?</Text>
              <Checkbox
                status={isSave ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSave(!isSave);
                }}
              />
            </View>
            <Button
              onPress={() => _confirm()}
              disabled={!card || !card.valid || loading}
              style={{
                margin: 16,
              }}
              labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
              color={colors.primary}
              loading={loading ? <ActivityIndicator /> : null}
              mode="contained">
              {loading ? 'Memproses Kartu Anda' : 'Selesaikan Pembayaran'}
            </Button>
          </>
        )}
      </ScrollView>
      <FacebookWebView
        ref={webviewModal}
        uri={paymentUrl}
        onClose={() =>
          navigation.replace('TransactionView', {trxno: trx.trxno})
        }
      />
    </>
  );
};

export default memo(PaymentCC);
