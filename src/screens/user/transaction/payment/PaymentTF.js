import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';
import {useNavigation} from '@react-navigation/native';
import React, {memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import HeaderBack from '../../../../components/HeaderBack';
import {api} from '../../../../configs/api';
import {colors} from '../../../../constants/colors';
import {currencyFormat} from '../../../../utils/formatter';

const PaymentTF = ({trx}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const pay = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    console.log(
      `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/tf`,
    );
    await api
      .post(
        `/user/${user_data.user_id}/transaction/${trx.trxno}/payment/tf`,
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
          RNToasty.Success({
            title: res.data.message,
            position: 'bottom',
          });
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  useEffect(() => {
    pay();
  }, []);
  return (
    <>
      <HeaderBack
        title="BCA Bank Transfer"
        search={false}
        back={() =>
          navigation.replace('Transaction', {
            screen: 'TransactionView',
            params: {trxno: trx.trxno},
          })
        }
      />
      {loading ? (
        <View>
          <ActivityIndicator color="#1100BB" size="large" />
        </View>
      ) : (
        <>
          <ScrollView>
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
                  39 7978 9999
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString('3979789999');
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
                a/n PT. HARNIC ONLINE STORE
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
                  Rp{currencyFormat(trx.netsales + trx.ongkir - trx.discount)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(
                      String(trx.netsales + trx.ongkir - trx.discount),
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
            </Card>
            <Card
              style={{
                margin: 16,
                padding: 16,
                alignItems: 'center',
                elevation: 1,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 16,
                }}>
                Tips!
              </Text>
              <Text style={{textAlign: 'center'}}>
                Masukkan kode berikut di berita untuk verifikasi cepat
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
                  {trx.trxno}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(trx.trxno);
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
          </ScrollView>
          <View style={{margin: 16, zIndex: 1}}>
            <Button
              disabled={loading}
              color="green"
              style={{marginBottom: 8}}
              mode="contained"
              onPress={() =>
                Linking.openURL(
                  'whatsapp://send?text=Hai, mohon cek pembayaran transfer BCA untuk pesanan nomor ' +
                    trx.trxno +
                    '&phone=+6282166001212',
                )
              }>
              Chat CS
            </Button>
            <Button
              disabled={loading}
              mode="contained"
              onPress={() =>
                navigation.replace('Transaction', {
                  screen: 'TransactionView',
                  params: {trxno: trx.trxno},
                })
              }>
              Selesai
            </Button>
          </View>
        </>
      )}
    </>
  );
};

export default memo(PaymentTF);
