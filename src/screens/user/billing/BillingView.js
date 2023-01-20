import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState, useRef} from 'react';
import {Dimensions, RefreshControl, ScrollView, View} from 'react-native';
import CountDown from 'react-native-countdown-component';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Text,
  Title,
} from 'react-native-paper';
import HTML from 'react-native-render-html';
import {RNToasty} from 'react-native-toasty';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';
import {colors} from '../../../constants/colors';
import {currencyFormat} from '../../../utils/formatter';

const BillingView = ({navigation, route}) => {
  const {trxno} = route.params;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const modalVA = useRef(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const WINDOW_HEIGHT = Dimensions.get('window').height;

  const getData = async (t) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(`/user/${user_data.user_id}/billing/${t}`, {
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

  const continuePayment = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .post(
        `/user/${user_data.user_id}/billing/${trxno}/payment/va/CONTINUE`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        setLoading(false);
        // console.log(res.data.data);
        if (res.data.success) {
          getDuration(res.data.data.expired_time);
          setPaymentData(res.data.data);
        } else {
          modalVA.current?.close();
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        modalVA.current?.close();
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const getDuration = (t) => {
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

  const cancel = async (t) => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .post(
        `/user/${user_data.user_id}/billing/${t}/void`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        if (res.data.success) {
          navigation.replace('UserBilling', {user_id: user_data.user_id});
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
          position: 'bottom',
        });
      })
      .finally(() => setLoading(false));
  };

  const _handleRefresh = () => {
    setData(null);
    setLoading(true);
    getData(trxno).finally(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    getData(trxno).finally(() => setLoading(false));
  }, [isFocused]);

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
        : 'alert-circle-outline';
    return res;
  };

  return (
    <>
      <HeaderBack title={trxno} search={false} />
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
            <Card style={{marginTop: 16}}>
              <Card.Content style={{alignItems: 'flex-start'}}>
                <Title>Token Number</Title>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ddd',
                    padding: 8,
                    borderRadius: 8,
                  }}>
                  {data.status >= 2 && data.sn ? (
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#333',
                      }}>
                      {data.sn.split('/')[0]}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#333',
                      }}>
                      Belum Tersedia
                    </Text>
                  )}
                </View>
              </Card.Content>
            </Card>
            {data.status == 0 ? (
              <Button
                mode="contained"
                style={{marginTop: 32}}
                onPress={() =>
                  navigation.replace('BIllingPayment', {
                    screen: 'BillingPayment',
                    params: {
                      trx: data,
                    },
                  })
                }>
                BAYAR
              </Button>
            ) : data.status == 1 && data.payment_method == 3 ? (
              <Button
                mode="contained"
                style={{marginTop: 32}}
                onPress={() => {
                  continuePayment();
                  modalVA.current?.open();
                }}>
                Lanjutkan Pembayaran
              </Button>
            ) : (
              <Button disabled mode="contained" style={{marginTop: 32}}>
                BAYAR
              </Button>
            )}
            {data.status < 2 ? (
              <Button
                onPress={() => cancel(data.trxno)}
                mode="contained"
                color={colors.error}
                style={{marginTop: 8}}>
                BATALKAN TRANSAKSI
              </Button>
            ) : (
              <Button disabled mode="contained" style={{marginTop: 8}}>
                BATALKAN TRANSAKSI
              </Button>
            )}
          </>
        )}
      </ScrollView>
      <Modalize
        ref={modalVA}
        modalHeight={WINDOW_HEIGHT * 0.8}
        modalStyle={{padding: 16}}>
        {paymentData ? (
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
                <CountDown
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
                    {paymentData.rekno}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(paymentData.rekno);
                      RNToasty.Show({
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
                  Virtual Account {paymentData.va_bank.bank_name}
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
                    Rp{currencyFormat(paymentData.netsales)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(String(paymentData.netsales));
                      RNToasty.Show({
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
              {paymentData && paymentData.va_bank && (
                <>
                  <Title style={{marginHorizontal: 16, marginVertical: 8}}>
                    Mobile Banking
                  </Title>
                  <HTML source={{html: paymentData.va_bank.guide_mobile}} />
                  <Title style={{marginHorizontal: 16, marginVertical: 8}}>
                    ATM
                  </Title>
                  <HTML source={{html: paymentData.va_bank.guide_atm}} />
                </>
              )}
            </ScrollView>
            <Button
              onPress={() => modalVA.current?.close()}
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
            <Text style={{fontSize: 12}}>Processing Secure paymentData...</Text>
          </View>
        )}
      </Modalize>
    </>
  );
};

export default BillingView;
