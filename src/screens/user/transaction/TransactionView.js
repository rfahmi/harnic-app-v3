import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import FastImage from 'react-native-fast-image';
import {Modalize} from 'react-native-modalize';
import {Button, Card, Divider, List, Title} from 'react-native-paper';
import Timeline from 'react-native-timeline-flatlist';
import {RNToasty} from 'react-native-toasty';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';
import {colors} from '../../../constants/colors';
import Empty from '../../../organism/empty';
import ListSkeleton from '../../../organism/skeleton/ListSkeleton';
import {currencyFormat} from '../../../utils/formatter';

const TransactionView = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {trxno} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const unfulfilled = data && data?.items.filter((a) => a.qty < a.qorder);
  const [payment, setPayment] = useState(null);
  const payment_modal = useRef(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const MODAL_HEIGHT = Dimensions.get('window').height * 0.7;

  const getData = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(`/user/${user_data.user_id}/transaction/${trxno}`, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then((res) => {
        setLoading(false);
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
        setLoading(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const voidTrx = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .post(
        `/user/${user_data.user_id}/transaction/${data.trxno}/void`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          getData();
          RNToasty.Success({
            title: res.data.message,
            position: 'bottom',
          });
        } else {
          setLoading(false);
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
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

  const receive = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

    await api
      .post(
        `/user/${user_data.user_id}/transaction/${data.trxno}/receive`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          getData();
          RNToasty.Success({
            title: res.data.message,
            position: 'bottom',
          });
        } else {
          setLoading(false);
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch((e) => {
        setLoading(false);

        RNToasty.Error({
          title: e.message,
          position: 'center',
        });
      });
  };

  const review = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(
        `/user/${user_data.user_id}/transaction/${data.trxno}/review/items`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          navigation.push('TransactionReview', {
            trxno: data.trxno,
            items: res.data.data,
          });
        } else {
          setLoading(false);
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
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

  const rebuyItems = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .post(
        `/user/${user_data.user_id}/transaction/${data.trxno}/rebuy`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          navigation.replace('App', {
            screen: 'Cart',
          });
          RNToasty.Success({
            title: res.data.message,
            position: 'bottom',
          });
        } else {
          setLoading(false);
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
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

  const getDuration = (t) => {
    // Coundown timer for a given expiry date-time
    let date = moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss');
    // Getting the current date-time
    // You can set your own date-time
    let expirydate = t;

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

  const getPaymentStatus = () => {
    if (data) {
      console.log('PAYMENT STATUS', data);
      getDuration(data.expired_time);
      switch (data.payment_method_code) {
        case 1:
          setPayment({
            method: 'Bank Transfer',
            method_code: 'Bank Transfer',
            total: data.total,
            bank: 'BCA',
            rekno: '3979789999',
            expired_time: data.expired_time,
          });
          break;
        case 2:
          let reff = data.reff_bank;
          let code = reff.split(';');
          let bank = '';
          switch (code[1]) {
            case 'BMRI':
              bank = 'Bank Mandiri';
              break;
            case 'IBBK':
              bank = 'Maybank';
              break;
            case 'BBBA':
              bank = 'Bank Permata';
              break;
            case 'BNIN':
              bank = 'BNI';
              break;
            case 'HNBN':
              bank = 'KEB Hana';
              break;
            case 'BRIN':
              bank = 'Bank BRI';
              break;
            case 'BNIA':
              bank = 'CIMB Niaga';
              break;
            case 'BDIN':
              bank = 'Bank Danamon';
              break;

            default:
              break;
          }
          setPayment({
            method: 'Virtual Account',
            method_code: 'Virtual Account',
            total: data.total,
            bank: bank,
            rekno: data.payment_va,
            expired_time: data.expired_time,
          });
          break;
        case 4:
          setPayment({
            method: 'Kartu Kredit',
            method_code: 'cc',
            total: null,
            bank: null,
            rekno: null,
            expired_time: data.expired_time,
          });
          break;
        case 5:
          setPayment({
            method: 'Virtual Account',
            method_code: 'va',
            bank: 'BCA',
            rekno: '12105' + data.payment_va,
            expired_time: data.expired_time,
          });
          break;

        default:
      }
      payment_modal.current?.open();
    }
  };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       navigation.popToTop();
  //       return true;
  //     };

  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //     return () =>
  //       BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, [navigation]),
  // );
  useEffect(() => {
    payment_modal.current?.close();
    getData();
  }, [isFocused]);

  return (
    <>
      <HeaderBack
        title="Pesanan Anda"
        search={false}
        // back={() => {
        //   navigation.popToTop();
        // }}
      />
      {!data ? (
        <>
          <ListSkeleton />
          <ListSkeleton />
          <ListSkeleton />
        </>
      ) : (
        <>
          <Modalize ref={payment_modal} modalHeight={MODAL_HEIGHT}>
            {payment && (
              <ScrollView style={{padding: 16}}>
                <Title>Selesaikan Pembayaran</Title>
                <>
                  <View
                    style={{
                      marginVertical: 16,
                      justifyContent: 'center',
                    }}>
                    {totalDuration && (
                      <CountDown
                        until={totalDuration}
                        timetoShow={('H', 'M', 'S')}
                        digitStyle={{backgroundColor: colors.primary}}
                        digitTxtStyle={{color: colors.white}}
                        timeLabelStyle={{
                          color: colors.primary,
                          fontWeight: 'bold',
                        }}
                        size={18}
                      />
                    )}
                  </View>
                  <Card
                    style={{
                      margin: 16,
                      // padding: 16,
                      alignItems: 'center',
                      elevation: 0,
                    }}>
                    {payment.rekno && (
                      <>
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
                            {payment && payment.rekno}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              Clipboard.setString(payment && payment.rekno);
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
                      </>
                    )}
                    {payment.bank && (
                      <Text style={{textAlign: 'center'}}>
                        {payment && payment.method} {payment && payment.bank}
                      </Text>
                    )}
                    {payment.total && (
                      <>
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
                            Rp{currencyFormat(payment && payment.total)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              Clipboard.setString(
                                String(payment && payment.total),
                              );
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
                      </>
                    )}
                  </Card>
                </>
                {payment.method_code === 'cc' && (
                  <>
                    <View>
                      <Empty
                        image="card_payment"
                        title="Pembayaran Sebelumnya Belum Selesai"
                        caption="Silahkan lanjutkan dengan menekan tombol berikut"
                      />
                    </View>
                    <View style={{marginTop: 16}}>
                      <Button
                        mode="contained"
                        onPress={() =>
                          navigation.push('Payment', {
                            screen: 'Pay',
                            params: {trx: data, code: 'cc'},
                          })
                        }>
                        Bayar dengan Kartu Kredit {data.method_code}
                      </Button>
                    </View>
                  </>
                )}
              </ScrollView>
            )}
          </Modalize>
          <ScrollView style={{backgroundColor: '#fff'}}>
            <List.Item
              title={`Pesanan ${data.trxno}`}
              description={`Status: ${data.status_desc}`}
            />
            <Divider />
            <View style={{paddingHorizontal: 16}}>
              <Title>Belanjaan Anda</Title>
            </View>
            {unfulfilled.length > 0 && (
              <View
                style={{
                  padding: 8,
                  margin: 8,
                  borderRadius: 8,
                  backgroundColor: '#FFFF88',
                }}>
                <Text style={{fontSize: 12, color: '#333', marginBottom: 4}}>
                  Ada {unfulfilled.length} Produk tidak terpenuhi!
                </Text>
              </View>
            )}
            {data &&
              data.items.map((item) => (
                <View key={`TrxItem${item.itemid}`}>
                  {item.qty === 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#000',
                        opacity: 0.3,
                        zIndex: 9,
                      }}
                    />
                  )}
                  <List.Item
                    onPress={() =>
                      navigation.push('Search', {
                        screen: 'Product',
                        params: {itemid: item.itemid},
                      })
                    }
                    style={{paddingHorizontal: 16}}
                    title={item.online_name}
                    titleStyle={{fontSize: 12}}
                    titleNumberOfLines={2}
                    description={
                      <View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            paddingTop: 8,
                          }}>
                          <View
                            style={{
                              flex: 1,
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: 'orange',
                              }}>
                              Rp{currencyFormat(item.price)}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={{
                            fontSize: 11,
                            marginTop: 8,
                          }}>
                          Subtotal: Rp{currencyFormat(item.price * item.qty)}
                        </Text>
                      </View>
                    }
                    right={() => (
                      <View
                        style={{
                          padding: 22,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: item.qty > 0 ? colors.primary : colors.red,
                          }}>
                          x {item.qty}
                        </Text>
                        {item.qty < item.qorder && (
                          <View
                            style={
                              {
                                // backgroundColor: '#555',
                              }
                            }>
                            <Text
                              style={{
                                fontSize: 9,
                                color: '#333',
                              }}>
                              Kurang {item.qorder - item.qty} pcs
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                    left={() => (
                      <View style={{justifyContent: 'center'}}>
                        <View
                          style={{
                            width: 72,
                            aspectRatio: 1 / 1,
                            elevation: 1,
                          }}>
                          <FastImage
                            source={{
                              uri:
                                Platform.OS === 'ios'
                                  ? item.picture_ios
                                  : item.picture,
                            }}
                            style={{
                              flex: 1,
                              backgroundColor: '#eee',
                              borderRadius: 1,
                            }}
                          />
                        </View>
                      </View>
                    )}
                  />
                  <Divider />
                </View>
              ))}
            {data && data.tracking.length > 0 && (
              <>
                <View style={{paddingHorizontal: 16}}>
                  <Title>Lacak Pengiriman</Title>
                </View>
                <View style={{padding: 16}}>
                  <Timeline
                    data={data.tracking}
                    showTime
                    timeStyle={{color: '#111'}}
                    timeContainerStyle={{width: 60}}
                    titleStyle={{
                      color: '#111',
                    }}
                    descriptionStyle={{color: '#111'}}
                    detailContainerStyle={{
                      paddingHorizontal: 8,
                    }}
                    lineColor={colors.primaryLight}
                    eventContainerStyle={{paddingLeft: 14}}
                    circleColor={colors.primary}
                    circleSize={12}
                  />
                </View>
              </>
            )}
            <View style={{paddingHorizontal: 16}}>
              <Title>Detail Pengiriman</Title>
            </View>
            <Card style={{margin: 16, elevation: 4}}>
              <List.Item
                title="Penerima"
                right={() => (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: 16,
                    }}>
                    <Text>{data.shipping.pic_name}</Text>
                  </View>
                )}
              />
              <Divider />
              <List.Item
                title="Alamat"
                right={() => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: 16,
                    }}>
                    <Text style={{fontSize: 12, textAlign: 'right'}}>
                      {data.shipping.full_address}
                    </Text>
                  </View>
                )}
              />
              <Divider />
              <List.Item
                title="Ekspedisi"
                right={() => (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: 16,
                    }}>
                    <Text>{data.shipping.expedition_name}</Text>
                  </View>
                )}
              />
              <Divider />
              <List.Item
                title="Jenis Pengiriman"
                right={() => (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: 16,
                    }}>
                    <Text>{data.shipping.expedition_type_name}</Text>
                  </View>
                )}
              />
              <Divider />
              <List.Item
                title="Jam Terima"
                right={() => (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: 16,
                    }}>
                    <Text>{data.shipping.delivery_time_start}</Text>
                  </View>
                )}
              />
            </Card>
            {data.netsales > 0 && (
              <>
                <View style={{paddingHorizontal: 16}}>
                  <Title>Informasi Pembayaran</Title>
                </View>
                <List.Item
                  title="Metode Pembayaran"
                  right={() => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 16,
                      }}>
                      <Text>{data.payment_method || '-'}</Text>
                    </View>
                  )}
                />
                <Divider />
                <List.Item
                  title="Total Barang"
                  right={() => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 16,
                      }}>
                      <Text>Rp{data && currencyFormat(data.netsales)}</Text>
                    </View>
                  )}
                />
                <Divider />
                <List.Item
                  title="Diskon"
                  right={() => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 16,
                      }}>
                      <Text>Rp{data && currencyFormat(data.discount)}</Text>
                    </View>
                  )}
                />
                <Divider />
                <List.Item
                  title="Ongkos Kirim"
                  right={() => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 16,
                      }}>
                      {data.ongkir > 0 ? (
                        <Text>Rp{currencyFormat(data.ongkir)}</Text>
                      ) : (
                        <Text style={{fontWeight: 'bold', color: colors.green}}>
                          GRATIS
                        </Text>
                      )}
                    </View>
                  )}
                />
                <Divider />
                <List.Item
                  title="Total Bayar"
                  right={() => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 16,
                      }}>
                      <Text>
                        Rp
                        {data &&
                          currencyFormat(
                            data.netsales + data.ongkir - data.discount,
                          )}
                      </Text>
                    </View>
                  )}
                />
              </>
            )}
          </ScrollView>
          {data.status_code === '0' && data.netsales > 0 ? (
            <>
              <View
                style={{marginHorizontal: 16, marginVertical: 8, zIndex: 1}}>
                <Button
                  mode="contained"
                  onPress={() =>
                    navigation.push('Payment', {
                      screen: 'Payment',
                      params: {trx: data, fromStack: true},
                    })
                  }>
                  Bayar
                </Button>
              </View>
              <View style={{marginHorizontal: 16, marginBottom: 8, zIndex: 1}}>
                <Button color={colors.red} mode="contained" onPress={voidTrx}>
                  BATALKAN PESANAN
                </Button>
              </View>
            </>
          ) : data.status_code === '1' ? (
            <View style={{marginHorizontal: 16, marginVertical: 8, zIndex: 1}}>
              <Button
                disabled={loading}
                mode="contained"
                onPress={() => getPaymentStatus()}>
                SELESAIKAN PEMBAYARAN
              </Button>
            </View>
          ) : data.status_code === '5' ? (
            <View style={{marginHorizontal: 16, marginVertical: 8, zIndex: 1}}>
              <Button
                disabled={loading}
                mode="contained"
                onPress={() => {
                  receive();
                }}>
                {loading ? <ActivityIndicator /> : 'KONFIRMASI TERIMA'}
              </Button>
            </View>
          ) : data.status_code === '6' ? (
            <View style={{marginHorizontal: 16, marginVertical: 8, zIndex: 1}}>
              <Button
                disabled={loading}
                mode="contained"
                onPress={() => review()}>
                {loading ? <ActivityIndicator /> : 'BERI ULASAN'}
              </Button>
            </View>
          ) : (
            <View style={{marginHorizontal: 16, marginBottom: 8, zIndex: 1}}>
              <Button mode="contained" onPress={() => rebuyItems()}>
                BELI LAGI
              </Button>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default memo(TransactionView);
