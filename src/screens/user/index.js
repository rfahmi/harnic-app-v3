import AsyncStorage from '@react-native-community/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {
  Avatar,
  Button,
  Caption,
  Divider,
  List,
  Surface,
  Title,
} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {authentication} from '../../assets/images';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import Separator from '../../components/Separator';
import {api, app_version_name} from '../../configs/api';
import {setAuth} from '../../configs/redux/action/authActions';
import {colors} from '../../constants/colors';
import {deleteFcm} from '../../utils/fcm';
import HTML from 'react-native-render-html';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const User = ({navigation}) => {
  const dispatch = useDispatch();
  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;
  const modalizeRef = useRef(null);
  const auth = useSelector((state) => state.auth);
  const isFocused = useIsFocused();
  const [data, setData] = useState(null);
  const [info, setInfo] = useState(null);

  const getData = async () => {
    // const api_token = await AsyncStorage.getItem('api_token');
    const user_data = await AsyncStorage.getItem('user_data');
    user_data && setData(JSON.parse(user_data));
  };
  const getInfo = async (name) => {
    await api
      .get('/info/' + name)
      .then((res) => {
        if (res.data.success) {
          setInfo(res.data.data);
          modalizeRef.current?.open();
        } else {
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

  useEffect(() => {
    getData();
  }, [isFocused]);

  return (
    <>
      <FocusAwareStatusBar
        translucent
        backgroundColor="#fff"
        barStyle="dark-content"
      />
      {auth.isLogin ? (
        <>
          <ScrollView style={{marginHorizontal: 0, backgroundColor: '#fff'}}>
            <View
              style={{
                marginTop: STATUSBAR_HEIGHT,
                marginHorizontal: 16,
                marginBottom: 16,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Title
                  style={{
                    fontWeight: '600',
                    color: colors.primaryDark,
                  }}>
                  {data && data.user_name}
                </Title>
                {data && data.status ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: '#00d97e',
                      borderRadius: 6,
                      padding: 6,
                    }}>
                    <Text style={{marginRight: 8, fontSize: 12, color: '#fff'}}>
                      {data && data.user_group_name}
                    </Text>
                    <Icon name="check-circle" color="#fff" size={16} />
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: '#f6c343',
                      borderRadius: 6,
                      padding: 6,
                    }}>
                    <Text
                      style={{marginRight: 8, fontSize: 12, color: '#283e59'}}>
                      {data && data.user_email}
                    </Text>
                    <Icon name="information" color="#283e59" size={16} />
                  </View>
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Search', {
                      screen: 'SearchWebView',
                      params: {
                        title: 'Harnic Care',
                        url:
                          'https://tawk.to/chat/5d79fce5c22bdd393bb57440/default',
                      },
                    });
                  }}>
                  <Avatar.Image
                    size={80}
                    style={{backgroundColor: 'transparent'}}
                    source={require('../../assets/images/cs.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Separator color="#1100BB" />
            <List.Section>
              <List.Subheader>Pesanan</List.Subheader>
              <Surface
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginHorizontal: 16,
                  borderRadius: 6,
                  elevation: 0,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.push('Transaction', {
                      screen: 'UserTransaction',
                      params: {user_id: data.user_id, init: 0},
                    })
                  }
                  style={{
                    flex: 1,
                    backgroundColor: '#eee',
                    borderRadius: 6,
                    aspectRatio: 1 / 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 8,
                    padding: 6,
                  }}>
                  <Icon
                    color={colors.grayDark}
                    size={22}
                    name="clock-check-outline"
                  />
                  <Text style={{fontSize: 9}}>Baru</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.push('Transaction', {
                      screen: 'UserTransaction',
                      params: {user_id: data.user_id, init: 1},
                    })
                  }
                  style={{
                    flex: 1,
                    backgroundColor: '#eee',
                    borderRadius: 6,
                    aspectRatio: 1 / 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 8,
                    padding: 6,
                  }}>
                  <Icon
                    color={colors.grayDark}
                    size={22}
                    name="package-variant-closed"
                  />
                  <Text style={{fontSize: 9}}>Disiapkan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.push('Transaction', {
                      screen: 'UserTransaction',
                      params: {user_id: data.user_id, init: 2},
                    })
                  }
                  style={{
                    flex: 1,
                    backgroundColor: '#eee',
                    borderRadius: 6,
                    aspectRatio: 1 / 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 8,
                    padding: 6,
                  }}>
                  <Icon
                    color={colors.grayDark}
                    size={22}
                    name="truck-fast-outline"
                  />
                  <Text style={{fontSize: 9}}>Dikirim</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.push('Transaction', {
                      screen: 'UserTransaction',
                      params: {user_id: data.user_id, init: 3},
                    })
                  }
                  style={{
                    flex: 1,
                    backgroundColor: '#eee',
                    borderRadius: 6,
                    aspectRatio: 1 / 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 8,
                    padding: 6,
                  }}>
                  <Icon color={colors.grayDark} size={22} name="check" />
                  <Text style={{fontSize: 9}}>Diterima</Text>
                </TouchableOpacity>
              </Surface>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  paddingRight: 8,
                }}>
                <Button
                  mode="text"
                  color={colors.grayDark}
                  uppercase={false}
                  onPress={() =>
                    navigation.push('Transaction', {
                      screen: 'UserTransaction',
                      params: {user_id: data.user_id, init: 5},
                    })
                  }>
                  <Text
                    style={{
                      fontSize: 10,
                    }}>
                    Lihat Semua
                  </Text>
                </Button>
              </View>
            </List.Section>
            <Separator color="#1100BB" />
            <List.Section>
              <List.Subheader>Pengaturan</List.Subheader>
              <List.Item
                title="Kode Voucher"
                left={() => <List.Icon icon="ticket-percent-outline" />}
                onPress={() =>
                  navigation.push('UserVoucher', {user_id: data.user_id})
                }
              />
              <Divider />
              <List.Item
                title="Data Pengguna"
                left={() => <List.Icon icon="account-outline" />}
                onPress={() =>
                  navigation.push('UserData', {user_id: data.user_id})
                }
              />
              <Divider />
              <List.Item
                title="Password"
                left={() => <List.Icon icon="lock-outline" />}
                onPress={() => navigation.push('UserPassword')}
              />
              <Divider />
              <List.Item
                title="Alamat Kirim"
                left={() => <List.Icon icon="map-marker-outline" />}
                onPress={() =>
                  navigation.push('UserShipping', {
                    screen: 'UserShipping',
                    params: {user_id: data.user_id},
                  })
                }
              />
              <Divider />
              <List.Item
                title="Kartu Kredit"
                left={() => <List.Icon icon="credit-card-outline" />}
                onPress={() =>
                  navigation.push('UserCard', {user_id: data.user_id})
                }
              />
              <Divider />
              <List.Item
                title="Notifikasi"
                left={() => <List.Icon icon="bell-outline" />}
                onPress={() =>
                  navigation.push('UserNotification', {user_id: data.user_id})
                }
                // right={() => (
                //   <View
                //     style={{
                //       marginRight: 16,
                //       justifyContent: 'center',
                //       alignItems: 'center',
                //     }}>
                //     <Badge
                //       visible={true}
                //       style={{backgroundColor: 'orange', color: '#fff'}}>
                //       5
                //     </Badge>
                //   </View>
                // )}
              />
              {/* <Divider />
            <List.Item
              title="Aktivasi Akun"
              left={() => <List.Icon icon="check" />}
            /> */}
            </List.Section>
            <Separator color="#1100BB" />
            <List.Section>
              <List.Subheader>Informasi Lainnya</List.Subheader>
              <List.Item
                title="Informasi Pembayaran"
                left={() => <List.Icon icon="credit-card-outline" />}
                onPress={() => getInfo('informasi-pembayaran')}
              />
              <Divider />
              <List.Item
                title={`Shipping ${'&'} Delivery`}
                left={() => <List.Icon icon="truck-check-outline" />}
                onPress={() => getInfo('shipping-delivery')}
              />
              <Divider />
              <List.Item
                title="Informasi Return"
                left={() => <List.Icon icon="backup-restore" />}
                onPress={() => getInfo('informasi-return')}
              />
              <Divider />
              <List.Item
                title="Tentang Harnic"
                left={() => <List.Icon icon="information-outline" />}
                onPress={() => getInfo('about-us')}
              />
              <Divider />
              <List.Item
                title="Kebijakan Privasi"
                left={() => <List.Icon icon="shield-alert-outline" />}
                onPress={() => getInfo('kebijakan-privasi')}
              />
            </List.Section>
            <View style={{marginVertical: 16}} />
            <View style={{margin: 16}}>
              <Button
                mode="contained"
                color={colors.red}
                style={{borderRadius: 30, elevation: 0}}
                labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
                onPress={async () => {
                  await navigation.navigate('Auth');
                  await deleteFcm().then(() => {
                    dispatch(setAuth(false));
                    AsyncStorage.clear();
                  });
                }}>
                Log Out
              </Button>
            </View>
            <View style={{flex: 1, alignItems: 'center', height: 50}}>
              <Text style={{color: colors.gray, fontSize: 12}}>
                Versi {app_version_name}
              </Text>
              <Text style={{color: colors.gray, fontSize: 12}}>
                {'\u00A9'} PT. Harnic Online Store
              </Text>
            </View>
          </ScrollView>
          <Modalize
            ref={modalizeRef}
            modalHeight={Dimensions.get('window').height * 0.7}>
            <ScrollView style={{padding: 16}}>
              {info ? (
                <>
                  <Title>{info.page_title}</Title>
                  <HTML source={{html: info.page_content_html}} />
                </>
              ) : (
                <View style={{flex: 1}}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}
            </ScrollView>
          </Modalize>
        </>
      ) : (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
            // alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}>
          <Image
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').width * 0.5,
            }}
            resizeMode="contain"
            source={authentication}
          />
          <Title>Anda Belum Log In</Title>
          <Caption>
            Silahkan login/register untuk mendapatkan penawaran terbaik dari
            HARNIC ID
          </Caption>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Auth')}
            labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
            style={{marginTop: 16}}>
            LOG IN
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Auth', {screen: 'Register'})}
            labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
            style={{marginTop: 16}}>
            REGISTER
          </Button>
        </View>
      )}
    </>
  );
};

export default User;
