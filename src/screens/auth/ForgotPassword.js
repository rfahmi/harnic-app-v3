import qs from 'qs';
import React, {memo, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Button} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import BackButton from '../../components/BackButton';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Logo from '../../components/Logo';
import TextInput from '../../components/TextInput';
import {api} from '../../configs/api';
import {emailValidator} from '../../utils/validator';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState({value: '', error: ''});
  const [loading, setLoading] = useState(false);

  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({...email, error: emailError});
      return;
    }

    api
      .post(
        '/auth/forget',
        qs.stringify({
          email: email.value,
        }),
      )
      .then(async (res) => {
        setLoading(false);
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
        console.log(err);
        setLoading(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  return (
    <>
      <BackButton goBack={() => navigation.goBack()} />
      <View style={{padding: 16, flex: 1}}>
        <Background>
          <Logo />

          <Header>Lupa Password</Header>

          <TextInput
            label="E-mail address"
            returnKeyType="done"
            value={email.value}
            onChangeText={(text) => setEmail({value: text, error: ''})}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <Button
            style={{width: '100%', marginVertical: 10}}
            labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
            mode="contained"
            disabled={loading}
            loading={loading && <ActivityIndicator size="small" />}
            onPress={_onSendPressed}>
            Kirim Instruksi Reset
          </Button>
        </Background>
      </View>
    </>
  );
};

export default memo(ForgotPassword);
