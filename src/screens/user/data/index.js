import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import React, {useState, useEffect} from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  View,
  Platform,
  Text,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import HarnicToast from '@components/toast/HarnicToast';
import Button from '../../../components/Button';
import HeaderBack from '../../../components/HeaderBack';
import {api, app_version_name} from '../../../configs/api';
import {colors} from '../../../constants/colors';
import {deleteFcm} from '../../../utils/fcm';

const UserData = ({navigation, route}) => {
  const {user_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState({value: null, error: ''});
  const [email, setEmail] = useState({value: null, error: ''});
  const [phone, setPhone] = useState({value: null, error: ''});

  const getData = async id => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get('/user/' + id, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          setName({value: res.data.data.user_name, error: ''});
          setEmail({value: res.data.data.user_email, error: ''});
          setPhone({value: res.data.data.user_phone, error: ''});
        } else {
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
        console.log(res.data);
      })
      .catch(err => {
        console.log('false');
        HarnicToast.Show({
          title: err.message,
          position: 'center',
        });
      });
  };

  const updateData = async id => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .put('/user/' + id + '', qs.stringify({user_name: name.value}), {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          navigation.goBack();
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
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

  const _handleClose = async () => {
    Alert.alert(
      'Konfirmasi',
      'Anda yakin ingin menutup akun?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: async () => {
            const api_token = await AsyncStorage.getItem('api_token');
            await api
              .post(
                '/user/' + user_id + '/close',
                {},
                {
                  headers: {
                    Authorization: 'Bearer ' + api_token,
                  },
                },
              )
              .then(async res => {
                if (res.data.success) {
                  navigation.goBack();
                  HarnicToast.Show({
                    title: res.data.message,
                    position: 'bottom',
                  });

                  await navigation.replace('Auth');
                  await deleteFcm().then(() => {
                    dispatch(setAuth(false));
                    AsyncStorage.clear();
                  });
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
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const _handleRefresh = () => {
    setName({value: null, error: ''});
    setEmail({value: null, error: ''});
    setPhone({value: null, error: ''});
    setLoading(true);
    getData(user_id)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };
  const _handleUpdate = () => {
    setLoading(true);
    updateData(user_id)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    getData(user_id)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [user_id]);

  return (
    <>
      <HeaderBack title="Data Pengguna" search={false} />
      <ScrollView
        style={{margin: 16}}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }>
        <TextInput
          label="Nama Pengguna"
          returnKeyType="next"
          value={name.value}
          onChangeText={text => setName({value: text, error: ''})}
          error={!!name.error}
          errorText={name.error}
          autoCapitalize="none"
          style={{backgroundColor: 'transparent', marginBottom: 8}}
        />
        <TextInput
          disabled
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={text => setEmail({value: text, error: ''})}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={{backgroundColor: 'transparent', marginBottom: 8}}
        />
        <TextInput
          disabled
          label="Nomor HP"
          returnKeyType="next"
          value={phone.value}
          onChangeText={text => setPhone({value: text, error: ''})}
          error={!!phone.error}
          errorText={phone.error}
          autoCapitalize="none"
          style={{backgroundColor: 'transparent', marginBottom: 8}}
        />
      </ScrollView>
      <View style={{margin: 16}}>
        <Button mode="contained" onPress={() => _handleUpdate()}>
          Simpan
        </Button>
        {Platform.OS === 'ios' && (
          <Button
            mode="text"
            color={colors.error}
            onPress={() => _handleClose()}>
            Tutup Akun
          </Button>
        )}
      </View>
      <View style={{flex: 1, alignItems: 'center', height: 50}}>
        <Text style={{color: colors.gray, fontSize: 12}}>
          Versi {app_version_name}
        </Text>
      </View>
    </>
  );
};

export default UserData;
