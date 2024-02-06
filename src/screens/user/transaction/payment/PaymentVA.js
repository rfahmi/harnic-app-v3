import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-community/clipboard';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Modalize} from 'react-native-modalize';
import {Button, Card, Dialog, Paragraph, Title} from 'react-native-paper';
import HTML from 'react-native-render-html';
import HarnicToast from '@components/toast/HarnicToast';
import * as assets from '../../../../assets/images/banks';
import HeaderBack from '../../../../components/HeaderBack';
import {api} from '../../../../configs/api';
import {colors} from '../../../../constants/colors';
import {currencyFormat} from '../../../../utils/formatter';
import Countdown from '../../../../components/Countdown';

const PaymentVA = ({trx}) => {
  const navigation = useNavigation();
  const modal = useRef(null);
  const [loading, setLoading] = useState(false);
  const [bankSelected, setBankSelected] = useState(null);
  const [payment, setPayment] = useState(null);
  const [alert, setAlert] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const WINDOW_HEIGHT = Dimensions.get('window').height;

  const [data, setData] = useState(null);
  const _handleAlert = bank => {
    setBankSelected(bank);
    setAlert(true);
  };
  const _confirm = async bank_code => {
    setLoading(true);
    setAlert(false);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

    modal.current?.open();
    await api
      .post(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/va/${bank_code}`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then(res => {
        setLoading(false);
        // console.log(res.data.data);
        if (res.data.success) {
          getDuration(res.data.data.expired_time);
          setPayment(res.data.data);
        } else {
          modal.current?.close();
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        setLoading(false);
        modal.current?.close();
        HarnicToast.Show({
          title: err.message,
          position: 'center',
        });
      });
  };
  const getDuration = t => {
    // Coundown timer for a given expiry date-time
    let date = moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss');
    console.log('d', date);
    // Getting the current date-time
    // You can set your own date-time
    let expirydate = t;

    console.log('t', t);

    let diffr = moment.duration(moment(expirydate).diff(moment(date)));
    // Difference of the expiry date-time
    var hours = Number(diffr.asHours());
    var minutes = Number(diffr.minutes());
    var seconds = Number(diffr.seconds());

    // Converting in seconds
    var d = hours * 60 * 60 + minutes * 60 + seconds;

    // Settign up the duration of countdown
    setTotalDuration(d);
  };
  const getData = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/va/banks`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then(res => {
        if (res.data.success) {
          console.log(res.data.data);
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
    <>
      <HeaderBack title="Virtual Account" search={false} />

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
            <Paragraph>{`Anda memilih pembayaran virtual account dengan menggunakan Bank ${
              bankSelected && bankSelected.bank_name
            }, metode pembayaran dengan virtual account tidak dapat diubah setelah lanjut`}</Paragraph>
          )}
        </Dialog.Content>
        {!loading && (
          <Dialog.Actions>
            <Button onPress={() => setAlert(false)} color={colors.red}>
              Batal
            </Button>
            <Button
              onPress={() => _confirm(bankSelected && bankSelected.bank_code)}>
              Lanjutkan
            </Button>
          </Dialog.Actions>
        )}
      </Dialog>
      <Modalize
        ref={modal}
        onClose={() =>
          navigation.replace('TransactionView', {trxno: trx.trxno})
        }
        modalHeight={WINDOW_HEIGHT * 0.8}
        modalStyle={{padding: 16}}>
        {payment ? (
          <>
            <ScrollView
              style={{
                height: WINDOW_HEIGHT * 0.8 - 100,
              }}>
              <Title>Selesaikan Pembayaran</Title>
              <View
                style={{
                  marginVertical: 16,
                  justifyContent: 'center',
                }}>
                <Countdown
                  until={totalDuration}
                  timetoShow={('H', 'M', 'S')}
                  digitStyle={{backgroundColor: colors.primary}}
                  digitTxtStyle={{color: colors.white}}
                  timeLabelStyle={{color: colors.primary, fontWeight: 'bold'}}
                  size={18}
                />
              </View>
              <Card
                style={{
                  margin: 16,
                  padding: 16,
                  alignItems: 'center',
                  elevation: 1,
                }}>
                <Text style={{textAlign: 'center'}}>
                  Silahkan lakukan transfer ke:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}>
                    {payment.rekno}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(payment.rekno);
                      HarnicToast.Show({
                        title: 'Disalin ke papan klip',
                        position: 'center',
                      });
                    }}
                    style={{
                      backgroundColor: colors.gray,
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                      borderRadius: 20,
                      marginLeft: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: colors.white}}>Salin</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{textAlign: 'center'}}>
                  Virtual Account {payment.va_bank.bank_name}
                </Text>
                <Text style={{textAlign: 'center', marginTop: 16}}>
                  Dengan nominal:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}>
                    Rp{currencyFormat(payment.netsales)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(String(payment.netsales));
                      HarnicToast.Show({
                        title: 'Disalin ke papan klip',
                        position: 'center',
                      });
                    }}
                    style={{
                      backgroundColor: colors.gray,
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                      borderRadius: 20,
                      marginLeft: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: colors.white}}>Salin</Text>
                  </TouchableOpacity>
                </View>
              </Card>
              {payment && payment.va_bank && (
                <>
                  <Title style={{marginHorizontal: 16, marginVertical: 8}}>
                    Mobile Banking
                  </Title>
                  <HTML source={{html: payment.va_bank.guide_mobile}} />
                  <Title style={{marginHorizontal: 16, marginVertical: 8}}>
                    ATM
                  </Title>
                  <HTML source={{html: payment.va_bank.guide_atm}} />
                </>
              )}
            </ScrollView>
            <Button
              onPress={() =>
                navigation.replace('TransactionView', {trxno: trx.trxno})
              }
              style={{
                margin: 4,
                flex: 1,
                marginVertical: 16,
              }}
              labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
              color={colors.primary}
              mode="contained">
              Lihat Status Pesanan
            </Button>
          </>
        ) : (
          <View
            style={{
              flexGrow: 1,
              height: WINDOW_HEIGHT * 0.6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{fontSize: 12}}>Processing Secure Payment...</Text>
          </View>
        )}
      </Modalize>
    </>
  );
};

export default memo(PaymentVA);
