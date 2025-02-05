import {Card} from '@paraboly/react-native-card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native';
// import {Skeleton} from 'react-native-animated-skeleton';
import {Modalize} from 'react-native-modalize';
import {
  Button,
  Checkbox,
  Divider,
  List,
  TextInput,
  Title,
} from 'react-native-paper';
import HarnicToast from '@components/HarnicToast';
import FooterCheckout from '../../components/FooterCheckout';
import {api} from '../../configs/api';
import {colors} from '../../constants/colors';
import {currencyFormat} from '../../utils/formatter';

const Checkout = ({navigation, route}) => {
  const {total_item, total_item_slashed} = route.params;
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
  const [userGroup, setUserGroup] = useState(0);
  const [point, setPoint] = useState(0);
  const [usePoint, setUsePoint] = useState(false);

  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeAgreement, setTimeAgreement] = useState(true);
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
      .then(res => {
        setLoading(false);
        setLoading1(false);
        if (res.data.success) {
          if (res.data.data.length > 0) {
            setShipping(res.data.data);
            setSelectedShipping(res.data.data[0]);
            getExpedition(res.data.data[0].shipping_id);
          } else {
            HarnicToast.Show({
              title: 'Silahkan tambah alamat terlebih dahulu',
              position: 'center',
            });
          }
        } else {
          HarnicToast.Show({
            title: res.data.message,
            position: 'center',
          });
        }
      })
      .catch(err => {
        setLoading(false);
        setLoading1(false);
        HarnicToast.Show({
          title: err.message,
          position: 'center',
        });
      });
  };
  const getExpedition = async shipping_id => {
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
      .then(res => {
        setLoading(false);
        setLoading2(false);
        if (res.data.success) {
          setSelectedExpedition(res.data.data[0]);
          getType(shipping_id, res.data.data[0].id);
        } else {
          HarnicToast.Show({
            title: res.data.message,
            position: 'center',
          });
        }
      })
      .catch(err => {
        setLoading(false);
        setLoading2(false);
        HarnicToast.Show({
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
      .then(res => {
        setLoading(false);
        setLoading3(false);
        if (res.data.success) {
          setType(res.data.data);
          setSelectedType(res.data.data[0]);
          setTimeAgreement(Boolean(res.data.data[0].has_time));
          if (res.data.data[0].has_time) {
            getTime(shipping_id, expedition_id, res.data.data[0].id);
          } else {
            setTime(null);
            setSelectedTime(null);
          }
        } else {
          setLoading(false);
          setLoading3(false);
          HarnicToast.Show({
            title: res.data.message,
            position: 'center',
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
      .then(res => {
        setLoading(false);
        setLoading4(false);
        setSelectedTime(null);
        if (res.data.success) {
          setTime(res.data.data);
          // setSelectedTime(res.data.data[0]);
        } else {
          setTime(null);
          HarnicToast.Show({
            title: res.data.message,
            position: 'center',
          });
        }
      })
      .catch(err => {
        setLoading(false);
        setLoading4(false);
        HarnicToast.Show({
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
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          setVouchers(res.data.data);
        } else {
          HarnicToast.Show({
            title: res.data.message,
            position: 'center',
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

  const applyVoucher = async code => {
    if (!code) {
      HarnicToast.Show({
        title: 'Kode voucher kosong',
        position: 'center',
      });
      return;
    }
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get(`/user/${user_data.user_id}/voucher/${code}/check`, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        setLoading(false);
        if (res.data.data && res.data.success) {
          if (res.data.data.DiscValue > 0) {
            setSelectedVoucher(res.data.data);
          } else {
            setSelectedVoucher(null);
            HarnicToast.Show({
              title: 'Kode voucher tidak dapat digunakan',
              position: 'center',
            });
          }
        } else {
          setSelectedVoucher(null);
          if (res.data.success) {
            HarnicToast.Show({
              title: 'Kode tidak dikenal',
              position: 'center',
            });
          } else {
            HarnicToast.Show({
              title: res.data.message,
              position: 'center',
            });
          }
        }
      })
      .catch(err => {
        setLoading(false);
        setSelectedVoucher(null);
        HarnicToast.Show({
          title: err.message,
          position: 'center',
        });
      });
  };

  const getPoint = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get('/user/' + user_data.user_id, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        console.log(res.data.data);
        if (res.data.success) {
          let p = res.data.data;
          setPoint(p.total_point);
          setUserGroup(p.user_group);
        }
      })
      .catch(() => {
        console.log('false');
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('focus');
      getShipping();
      getVoucher();
      getPoint();
    }, []),
  );

  return (
    <>
      {total_item_slashed > 0 && (
        <View
          style={{
            padding: 8,
            backgroundColor: colors.green,
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>
            Anda Hemat Rp.{currencyFormat(total_item_slashed)}
          </Text>
        </View>
      )}
      <ScrollView>
        <KeyboardAvoidingView>
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
              title={
                selectedShipping
                  ? selectedShipping.shipping_name +
                    ' (' +
                    selectedShipping.pic_name +
                    ')'
                  : 'Pilih Alamat'
              }
              textContainerNumberOfLines={3}
              description={
                loading1 ? (
                  // <Skeleton
                  //   loaderStyle={{
                  //     width: 200,
                  //     height: 16,
                  //     marginVertical: 4,
                  //     backgroundColor: '#ddd',
                  //   }}
                  //   direction="column"
                  //   numberOfItems={1}
                  // />
                  <View />
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
              style={{marginHorizontal: 16, marginVertical: 8}}
            />
          </View>
          {type && (
            <Card
              title="Jenis Pengiriman"
              description={
                loading3 || loading2 ? (
                  // <Skeleton
                  //   loaderStyle={{
                  //     width: 200,
                  //     height: 16,
                  //     marginVertical: 4,
                  //     backgroundColor: '#ddd',
                  //   }}
                  //   direction="column"
                  //   numberOfItems={1}
                  // />
                  <View />
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
              style={{marginHorizontal: 16, marginBottom: 8}}
            />
          )}
          {time && (
            <>
              <Card
                title="Jam Terima Paket"
                description={
                  loading4 ? (
                    // <Skeleton
                    //   loaderStyle={{
                    //     width: 200,
                    //     height: 16,
                    //     marginVertical: 4,
                    //     backgroundColor: '#ddd',
                    //   }}
                    //   direction="column"
                    //   numberOfItems={1}
                    // />
                    <View />
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
                }}
              />

              {selectedTime?.start === '05:30' && (
                <View
                  style={{
                    margin: 16,
                    padding: 8,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    backgroundColor: '#FFFACD', // Light pastel yellow color
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#FFD700', // Light pastel gold border color
                  }}>
                  <Checkbox.Android
                    color={colors.primary}
                    status={timeAgreement ? 'unchecked' : 'checked'}
                    onPress={() => {
                      console.log(timeAgreement);
                      setTimeAgreement(!timeAgreement);
                    }}
                  />
                  <View style={{flex: 1}}>
                    <Text>
                      Saya menyetujui apabila pengiriman pada pukul 05.30, dan
                      customer tidak menjawab panggilan dari kurir Harnic, maka
                      paket akan diletakkan di gerbang rumah/lokasi pengiriman.
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
          <View style={{alignItems: 'center', marginVertical: 8}}>
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
            style={{marginHorizontal: 16}}
          />
          <View style={{alignItems: 'center', marginVertical: 12}}>
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
          <View style={{marginHorizontal: 16}}>
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
              numberOfLines={2}
              placeholder="Beri kami deskripsi tempat anda, patokan alamat dll (opsional)"
              onChangeText={e => setNote(e)}
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
            showPoint={userGroup === '0'}
            point={point}
            usePoint={usePoint}
            usePointChanged={() => {
              setUsePoint(!usePoint);
            }}
            disabled={
              loading ||
              !selectedShipping ||
              !selectedType ||
              (Boolean(selectedType.has_time) && !selectedTime) ||
              timeAgreement
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
                    title={`${item.shipping_name} (${item.pic_name})`}
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
                      console.log('JENIS', item);
                      setTimeAgreement(Boolean(item.has_time));
                      if (item.has_time) {
                        getTime(
                          selectedShipping.shipping_id,
                          setSelectedExpedition.id,
                          item.id,
                        );
                      } else {
                        //SINI
                        setSelectedTime(null);
                        setTime(null);
                      }
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
                      setTimeAgreement(item.start === '05:30');
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
              value={typedVoucher}
              style={{marginBottom: 8}}
              disabled={selectedVoucher}
              mode="outlined"
              autoCapitalize="characters"
              onChangeText={e => setTypedVoucher(e.toUpperCase())}
            />
            {!selectedVoucher ? (
              <Button
                mode="contained"
                disabled={!typedVoucher}
                onPress={() => {
                  applyVoucher(typedVoucher);
                  sheet_voucher.current?.close();
                }}>
                GUNAKAN DISKON
              </Button>
            ) : (
              <Button
                mode="contained"
                color={colors.error}
                onPress={() => {
                  setTypedVoucher('');
                  setSelectedVoucher(null);
                  sheet_voucher.current?.close();
                }}>
                COPOT DISKON
              </Button>
            )}
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
                      setTypedVoucher(item.vc_code.toUpperCase());
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
