import React, {useRef, useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Card} from '@paraboly/react-native-card';
import {colors} from '../../constants/colors';
import FooterCheckout from '../../components/FooterCheckout';
import {Modalize} from 'react-native-modalize';
import {
  Button,
  Divider,
  IconButton,
  List,
  TextInput,
  Title,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {RNToasty} from 'react-native-toasty';
import {api} from '../../configs/api';
import {currencyFormat} from '../../utils/formatter';
import {Skeleton} from 'react-native-animated-skeleton';
import {useFocusEffect} from '@react-navigation/native';

const Checkout = ({navigation, route}) => {
  const {total_item} = route.params;
  const sheet_shipping = useRef(null);
  const sheet_type = useRef(null);
  const sheet_time = useRef(null);
  const sheet_voucher = useRef(null);
  const MODAL_HEIGHT = Dimensions.get('window').height * 0.7;

  const [typedVoucher, setTypedVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [shipping, setShipping] = useState(null);
  // const [expedition, setExpedition] = useState(null);  //Option auto
  const [note, setNote] = useState(null);
  const [type, setType] = useState(null);
  const [time, setTime] = useState(null);
  const [vouchers, setVouchers] = useState(null);

  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const getShipping = async () => {
    setLoading(true);
    setLoading1(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

    await api
      .get('/user/' + user_data.user_id + '/shipping', {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then((res) => {
        setLoading(false);
        setLoading1(false);
        if (res.data.success) {
          setShipping(res.data.data);
          setSelectedShipping(res.data.data[0]);
          getExpedition(res.data.data[0].shipping_id);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        setLoading1(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const getExpedition = async (shipping_id) => {
    setLoading(true);
    setLoading2(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(`/user/${user_data.user_id}/shipping/${shipping_id}/expedition`, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then((res) => {
        setLoading(false);
        setLoading2(false);
        if (res.data.success) {
          setSelectedExpedition(res.data.data[0]);
          getType(shipping_id, res.data.data[0].id);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        setLoading2(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const getType = async (shipping_id, expedition_id) => {
    setLoading(true);
    setLoading3(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(
        `/user/${user_data.user_id}/shipping/${shipping_id}/expedition/${expedition_id}/type`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        setLoading(false);
        setLoading3(false);
        if (res.data.success) {
          setType(res.data.data);
          setSelectedType(res.data.data[0]);
          if (res.data.data[0].has_time) {
            getTime(shipping_id, expedition_id, res.data.data[0].id);
          } else {
            setTime(null);
            setSelectedTime(null);
          }
        } else {
          setLoading(false);
          setLoading3(false);
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
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

  const getTime = async (shipping_id, expedition_id, type_id) => {
    setLoading(true);
    setLoading4(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

    await api
      .get(
        `/user/${user_data.user_id}/shipping/${shipping_id}/expedition/${expedition_id}/type/${type_id}/time`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        setLoading(false);
        setLoading4(false);
        if (res.data.success) {
          setTime(res.data.data);
          // setSelectedTime(res.data.data[0]);
        } else {
          setTime(null);
          setSelectedTime(null);
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        setLoading4(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const getVoucher = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(`/user/${user_data.user_id}/voucher`, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setVouchers(res.data.data);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
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

  const applyVoucher = async (code) => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(`/user/${user_data.user_id}/voucher/${code}/check`, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.data && res.data.success) {
          if (res.data.data.DiscValue > 0) {
            setSelectedVoucher(res.data.data);
          } else {
            setSelectedVoucher(null);
            RNToasty.Warn({
              title: 'Kode voucher tidak dapat digunakan',
              position: 'center',
            });
          }
        } else {
          setSelectedVoucher(null);
          if (res.data.success) {
            RNToasty.Error({
              title: 'Kode tidak dikenal',
              position: 'center',
            });
          } else {
            RNToasty.Error({
              title: res.data.message,
              position: 'center',
            });
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        setSelectedVoucher(null);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('focus');
      getShipping();
      getVoucher();
    }, []),
  );

  return (
    <>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <View style={{position: 'relative'}}>
            <Button
              mode="contained"
              onPress={async () => {
                const user_data = JSON.parse(
                  await AsyncStorage.getItem('user_data'),
                );
                navigation.push('UserShipping', {
                  screen: 'UserShippingAdd',
                  params: {user_id: user_data.user_id},
                });
              }}
              labelStyle={{fontSize: 9}}
              style={{position: 'absolute', zIndex: 3, bottom: 20, right: 22}}
              uppercase={false}>
              + Tambah
            </Button>
            <Card
              title="Alamat"
              textContainerNumberOfLines={3}
              description={
                loading1 ? (
                  <Skeleton
                    loaderStyle={{
                      width: 200,
                      height: 16,
                      marginVertical: 4,
                      backgroundColor: '#ddd',
                    }}
                    direction="column"
                    numberOfItems={1}
                  />
                ) : selectedShipping ? (
                  selectedShipping.shipping_address +
                  ', ' +
                  selectedShipping.subdis_name +
                  ', ' +
                  selectedShipping.dis_name +
                  ', ' +
                  selectedShipping.city_name +
                  ', ' +
                  selectedShipping.prov_name +
                  ' ' +
                  selectedShipping.zip_code
                ) : (
                  'Pilih alamat'
                )
              }
              line
              iconType="MaterialCommunityIcons"
              iconName="map-marker"
              iconBackgroundColor={colors.primary}
              onPress={() => {
                sheet_shipping.current?.open();
              }}
              topRightText={
                selectedShipping && selectedShipping.default ? 'Default' : ''
              }
              style={{marginHorizontal: 16, marginVertical: 12}}
            />
          </View>
          <Card
            title="Jenis Pengiriman"
            description={
              loading3 || loading2 ? (
                <Skeleton
                  loaderStyle={{
                    width: 200,
                    height: 16,
                    marginVertical: 4,
                    backgroundColor: '#ddd',
                  }}
                  direction="column"
                  numberOfItems={1}
                />
              ) : selectedType ? (
                `${selectedExpedition.label} / ${selectedType.label}`
              ) : (
                'Pilih Jenis Pengiriman'
              )
            }
            iconType="MaterialCommunityIcons"
            iconName="package"
            iconBackgroundColor={colors.primary}
            onPress={() => {
              sheet_type.current?.open();
            }}
            style={{marginHorizontal: 16, marginBottom: 12}}
          />
          {time && (
            <Card
              title="Jam Terima Paket"
              description={
                loading4 ? (
                  <Skeleton
                    loaderStyle={{
                      width: 200,
                      height: 16,
                      marginVertical: 4,
                      backgroundColor: '#ddd',
                    }}
                    direction="column"
                    numberOfItems={1}
                  />
                ) : selectedTime ? (
                  `${selectedTime.day}${'\n'}${selectedTime.start} - ${
                    selectedTime.end
                  }`
                ) : (
                  <Text style={{color: 'red', fontWeight: 'bold'}}>
                    Pilih Jam Terima Paket!
                  </Text>
                )
              }
              iconType="MaterialCommunityIcons"
              iconName="clock"
              iconBackgroundColor="orange"
              onPress={() => {
                sheet_time.current?.open();
              }}
              style={{
                marginHorizontal: 16,
                marginBottom: 12,
              }}
            />
          )}
          <View style={{alignItems: 'center', marginVertical: 24}}>
            <Text
              style={{
                color: colors.grayDark,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Lebih Murah Pakai Voucher
            </Text>
            <Text style={{color: colors.grayDark, fontSize: 11}}>
              Gunakan voucher anda disini
            </Text>
          </View>
          <Card
            title="Kode Voucher"
            description={
              selectedVoucher
                ? selectedVoucher.code.toUpperCase()
                : 'Pilih Diskon Anda'
            }
            iconType="MaterialCommunityIcons"
            iconName="ticket-percent"
            iconBackgroundColor="green"
            onPress={() => {
              sheet_voucher.current?.open();
            }}
            style={{marginHorizontal: 16, marginBottom: 12}}
          />
          <View style={{alignItems: 'center', marginVertical: 16}}>
            <Text
              style={{
                color: colors.grayDark,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Biar Abang Kurir Gak Bingung
            </Text>
            <Text style={{color: colors.grayDark, fontSize: 11}}>
              Tulis patokan alamat anda disini
            </Text>
          </View>
          <View style={{margin: 16}}>
            <TextInput
              style={{
                backgroundColor: '#FEF4C5',
                borderRadius: 10,
                flex: 1,
                borderColor: 'transparent',
              }}
              label="Catatan Pengiriman"
              value={note}
              multiline
              mode="outlined"
              numberOfLines={3}
              placeholder="Beri kami deskripsi tempat anda, patokan alamat dll (opsional)"
              onChangeText={(e) => setNote(e)}
            />
          </View>
          <FooterCheckout
            product={total_item}
            shipping={selectedShipping}
            expedition={selectedExpedition}
            type={selectedType}
            time={selectedTime}
            voucher={selectedVoucher}
            note={note}
            disabled={
              loading ||
              (selectedType && selectedType.has_time && !selectedTime)
            }
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <Modalize ref={sheet_shipping} modalHeight={MODAL_HEIGHT}>
        <ScrollView style={{padding: 16}}>
          <Title>Alamat Kirim</Title>
          {shipping &&
            shipping.map((item, index) => {
              return (
                <View key={`addr${index}`}>
                  <List.Item
                    left={() => <List.Icon icon="map-marker-outline" />}
                    title={item.shipping_name}
                    description={
                      item.shipping_address +
                      ', ' +
                      item.subdis_name +
                      ', ' +
                      item.dis_name +
                      ', ' +
                      item.city_name +
                      ', ' +
                      item.prov_name +
                      ' ' +
                      item.zip_code
                    }
                    onPress={() => {
                      setSelectedShipping(item);
                      getExpedition(item.shipping_id);
                      sheet_shipping.current?.close();
                    }}
                  />
                  <Divider />
                </View>
              );
            })}
        </ScrollView>
      </Modalize>
      <Modalize ref={sheet_type} modalHeight={MODAL_HEIGHT}>
        <ScrollView style={{padding: 16}}>
          <Title>Jenis Pengiriman</Title>
          {type &&
            type.map((item, index) => {
              return (
                <View key={`type${index}`}>
                  <List.Item
                    left={() => <List.Icon icon="package-variant-closed" />}
                    title={item.label}
                    description={
                      item.fee > 0 ? `Rp${currencyFormat(item.fee)}` : 'Gratis'
                    }
                    descriptionStyle={{
                      fontWeight: item.fee ? 'normal' : 'bold',
                      color: item.fee ? '#888' : 'green',
                    }}
                    onPress={() => {
                      setSelectedType(item);
                      item.has_time &&
                        getTime(
                          selectedShipping.shipping_id,
                          setSelectedExpedition.id,
                          item.id,
                        );
                      sheet_type.current?.close();
                    }}
                  />
                  <Divider />
                </View>
              );
            })}
        </ScrollView>
      </Modalize>
      <Modalize ref={sheet_time} modalHeight={MODAL_HEIGHT}>
        <ScrollView style={{padding: 16}}>
          <Title>Jam Terima Paket</Title>
          {time &&
            time.map((item, index) => {
              return (
                <View key={`time${index}`}>
                  <List.Item
                    left={() => <List.Icon icon="clock-outline" />}
                    title={item.day}
                    description={`${item.start} hingga ${item.end}`}
                    onPress={() => {
                      setSelectedTime(item);
                      sheet_time.current?.close();
                    }}
                  />
                  <Divider />
                </View>
              );
            })}
        </ScrollView>
      </Modalize>
      <Modalize
        ref={sheet_voucher}
        modalHeight={MODAL_HEIGHT}
        modalStyle={{flex: 1, zIndex: 3}}>
        <View style={{padding: 16}}>
          <Title>Kode Voucher</Title>
          <View>
            <TextInput
              mode="outlined"
              autoCapitalize="characters"
              onChangeText={(e) => setTypedVoucher(e)}
            />
            <IconButton
              icon="check"
              style={{
                backgroundColor: colors.primary,
                position: 'absolute',
                right: 4,
                top: 10,
                zIndex: 3,
              }}
              disabled={!typedVoucher}
              color={colors.white}
              onPress={() => {
                applyVoucher(typedVoucher);
                sheet_voucher.current?.close();
              }}
            />
          </View>
          {vouchers &&
            vouchers.map((item, index) => {
              return (
                <View key={`voucher${index}`}>
                  <List.Item
                    left={() => <List.Icon icon="ticket-percent" />}
                    title={item.vc_code.toUpperCase()}
                    description={item.vc_name}
                    onPress={() => {
                      applyVoucher(item.vc_code);
                      sheet_voucher.current?.close();
                    }}
                  />
                  <Divider />
                </View>
              );
            })}
        </View>
      </Modalize>
    </>
  );
};

export default Checkout;
