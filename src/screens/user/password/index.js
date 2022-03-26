import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import React, {useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import Button from '../../../components/Button';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';

const UserPassword = ({navigation, route}) => {
  const {user_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [new1, setNew1] = useState({value: null, error: ''});
  const [new2, setNew2] = useState({value: null, error: ''});

  const updateData = async (id) => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .put('/user/' + id + '', qs.stringify({user_password: new2.value}), {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then((res) => {
        if (res.data.success) {
          navigation.goBack();
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
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const _handleRefresh = () => {
    setNew1({value: null, error: ''});
    setNew2({value: null, error: ''});
  };
  const _handleUpdate = () => {
    setLoading(true);
    updateData(user_id)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };
  return (
    <>
      <HeaderBack
        title="Ubah Password"
        search={false}
        back={() => navigation.replace('User')}
      />
      <ScrollView
        style={{margin: 16}}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }>
        <TextInput
          label="Password Baru"
          returnKeyType="next"
          value={new1.value}
          onChangeText={(text) => setNew1({value: text, error: ''})}
          error={!!new1.error}
          errorText={new1.error}
          autoCapitalize="none"
          secureTextEntry={true}
          style={{backgroundColor: 'transparent', marginBottom: 8}}
        />
        <TextInput
          label="Ulangi Password Baru"
          returnKeyType="next"
          value={new2.value}
          onChangeText={(text) => setNew2({value: text, error: ''})}
          error={!!new2.error}
          errorText={new2.error}
          autoCapitalize="none"
          secureTextEntry={true}
          style={{backgroundColor: 'transparent', marginBottom: 8}}
        />
      </ScrollView>
      <View style={{margin: 16}}>
        <Button mode="contained" onPress={() => _handleUpdate()}>
          Simpan
        </Button>
      </View>
    </>
  );
};

export default UserPassword;
