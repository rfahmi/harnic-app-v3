import AsyncStorage from '@react-native-async-storage/async-storage';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import qs from 'qs';
import React, {memo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Modalize} from 'react-native-modalize';
import {Button} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import {useDispatch} from 'react-redux';
import SwitchButton from 'switch-button-react-native';
import BackButton from '../../components/BackButton';
import Background from '../../components/Background';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import Header from '../../components/Header';
import Logo from '../../components/Logo';
import TextInput from '../../components/TextInput';
import {api} from '../../configs/api';
import {setAuth, setPriceType} from '../../configs/redux/action/authActions';
import {colors} from '../../constants/colors';
import {saveFcm} from '../../utils/fcm';
import {
  emailValidator,
  passwordValidator,
  phoneValidator,
} from '../../utils/validator';
import Countdown from '../../components/Countdown';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [waitingTime, setWaitingTime] = useState(0);
  const [showSendAgain, setShowSendAgain] = useState(true);
  const [mode, setMode] = useState(1);
  const [phone, setPhone] = useState({value: null, error: ''});
  const [email, setEmail] = useState({value: null, error: ''});
  const [password, setPassword] = useState({value: null, error: ''});
  const [loading, setLoading] = useState(false);
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const WINDOW_WIDTH = Dimensions.get('window').width;

  const modalOTP = useRef(null);
  const modalPassword = useRef(null);

  const _onLoginPressed = () => {
    setLoading(true);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      setLoading(false);
      return;
    }
    api
      .post(
        '/auth/signin/email',
        qs.stringify({email: email.value, password: password.value}),
      )
      .then(async res => {
        setLoading(false);
        if (res.data.success) {
          navigation.navigate('App', {screen: 'Home'});
          dispatch(setAuth(true));
          dispatch(setPriceType(res.data.data.user.price_type));
          AsyncStorage.setItem('api_token', res.data.data.api_token);
          AsyncStorage.setItem('user_data', JSON.stringify(res.data.data.user));
          const fcm_token = await AsyncStorage.getItem('fcm_token');
          saveFcm(fcm_token);
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
      .catch(err => {
        setLoading(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const _onLoginPhonePressed = () => {
    setLoading(true);
    const phoneError = phoneValidator(phone.value);

    if (phoneError) {
      setPhone({...phone, error: phoneError});
      setLoading(false);
      return;
    }
    api
      .post('/auth/phone/check', qs.stringify({phone: phone.value}))
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          if (res.data.registered) {
            if (res.data.has_password) {
              modalPassword.current?.open();
            } else {
              sendOTP(phone.value).then(r => {
                if (r) {
                  setShowSendAgain(false);
                  setWaitingTime(60 * 2);
                  Keyboard.dismiss();
                  modalOTP.current?.open();
                } else {
                  RNToasty.Success({
                    title: res.data.message,
                    position: 'bottom',
                  });
                }
              });
            }
          } else {
            setPhone({...phone, error: res.data.message});
          }
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        setLoading(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const sendOTP = p => {
    const result = api
      .post('/auth/phone/otp', qs.stringify({phone: p}))
      .then(res => {
        if (res.data.success) {
          return true;
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
          return false;
        }
      })
      .catch(err => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
        return false;
      });
    return result;
  };

  const _onOtpSubmit = code => {
    setLoading(true);
    const phoneError = phoneValidator(phone.value);

    if (phoneError) {
      setPhone({...phone, error: phoneError});
      setLoading(false);
      return;
    }
    api
      .post('/auth/signin/phone', qs.stringify({phone: phone.value, otp: code}))
      .then(async res => {
        setLoading(false);
        if (res.data.success) {
          modalOTP.current?.close();
          navigation.navigate('App', {screen: 'Home'});
          dispatch(setAuth(true));
          dispatch(setPriceType(res.data.data.user.price_type));
          AsyncStorage.setItem('api_token', res.data.data.api_token);
          AsyncStorage.setItem('user_data', JSON.stringify(res.data.data.user));
          const fcm_token = await AsyncStorage.getItem('fcm_token');
          saveFcm(fcm_token);
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
      .catch(err => {
        setLoading(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const _onPasswordSubmit = () => {
    setLoading(true);
    const phoneError = phoneValidator(phone.value);

    if (phoneError) {
      setPhone({...phone, error: phoneError});
      setLoading(false);
      return;
    }
    api
      .post(
        '/auth/signin/phone',
        qs.stringify({phone: phone.value, password: password.value}),
      )
      .then(async res => {
        setLoading(false);
        if (res.data.success) {
          modalPassword.current?.close();
          navigation.navigate('App', {screen: 'Home'});
          dispatch(setAuth(true));
          dispatch(setPriceType(res.data.data.user.price_type));
          AsyncStorage.setItem('api_token', res.data.data.api_token);
          AsyncStorage.setItem('user_data', JSON.stringify(res.data.data.user));
          const fcm_token = await AsyncStorage.getItem('fcm_token');
          saveFcm(fcm_token);
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
      .catch(err => {
        setLoading(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
      <BackButton goBack={() => navigation.replace('App')}/>
      <ScrollView style={{padding: 16}}>
        <Background>
          <FocusAwareStatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          {/* <View style={{height: '30%',backgroundColor:'yellow',width:100}} /> */}
          <View
            style={{paddingTop: '20%', marginBottom: 16, alignItems: 'center'}}>
            <Logo />

            <Header>Selamat datang kembali</Header>
          </View>
          <SwitchButton
            onValueChange={val => setMode(val)} // this is necessary for this component
            text1="Nomor HP" // optional: first text in switch button --- default ON
            text2="Email" // optional: second text in switch button --- default OFF
            switchWidth={200} // optional: switch width --- default 44
            switchHeight={44} // optional: switch height --- default 100
            switchdirection="ltr" // optional: switch button direction ( ltr and rtl ) --- default ltr
            switchBorderRadius={100} // optional: switch border radius --- default oval
            switchSpeedChange={100} // optional: button change speed --- default 100
            switchBorderColor="#d4d4d4" // optional: switch border color --- default #d4d4d4
            switchBackgroundColor="#fff" // optional: switch background color --- default #fff
            btnBorderColor={colors.grayLight} // optional: button border color --- default #00a4b9
            btnBackgroundColor={colors.gray} // optional: button background color --- default #00bcd4
            fontColor="#b1b1b1" // optional: text font color --- default #b1b1b1
            activeFontColor="#fff" // optional: active font color --- default #fff
          />

          {mode === 1 ? (
            <>
              <TextInput
                label="Nomor HP"
                value={phone.value}
                onChangeText={text => setPhone({value: text, error: ''})}
                error={!!phone.error}
                errorText={phone.error}
                autoCapitalize="none"
                keyboardType="phone-pad"
              />
              <Button
                style={{width: '100%', marginVertical: 10, zIndex: 0}}
                labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
                loading={loading && <ActivityIndicator size="small" />}
                mode="contained"
                disabled={!showSendAgain || loading}
                onPress={_onLoginPhonePressed}>
                {showSendAgain ? 'Log in' : 'Coba Lagi Nanti'}
              </Button>
            </>
          ) : (
            <>
              <TextInput
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
              />
              <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword({value: text, error: ''})}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
              />

              <View style={styles.forgotPassword}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.label}>Lupa password?</Text>
                </TouchableOpacity>
              </View>

              <Button
                style={{width: '100%', marginVertical: 10, zIndex: 0}}
                labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
                disabled={loading}
                loading={loading && <ActivityIndicator size="small" />}
                mode="contained"
                onPress={_onLoginPressed}>
                Log in
              </Button>
            </>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Tidak punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.push('Register')}>
              <Text style={styles.link}>Daftar disini</Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity onPress={() => modalOTP.current?.open()}>
            <Text style={styles.link}>Open OTP</Text>
          </TouchableOpacity> */}
        </Background>
      </ScrollView>
      <Modalize
        ref={modalOTP}
        modalHeight={WINDOW_HEIGHT * 0.7}
        modalStyle={{flex: 1, zIndex: 3}}>
        {loading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={{flex: 1, padding: 16}}>
            <Text
              style={{
                marginTop: 16,
                fontWeight: 'bold',
                fontSize: 24,
                width: WINDOW_WIDTH * 0.6,
              }}>
              Masukkan Kode OTP
            </Text>
            <Text>
              Kami mengirimkan SMS berisi kode OTP ke nomor {phone.value}
            </Text>
            <View style={{alignItems: 'center'}}>
              <OTPInputView
                style={{width: '70%', height: 200}}
                pinCount={4}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={code => {
                  _onOtpSubmit(code);
                }}
              />
              {showSendAgain ? (
                <Button
                  mode="contained"
                  onPress={_onLoginPhonePressed}
                  disabled={!showSendAgain}>
                  Kirim Ulang
                </Button>
              ) : (
                <>
                  <Text
                    style={{fontSize: 11, color: '#555', marginVertical: 8}}>
                    Kirim ulang setelah:
                  </Text>
                  <Countdown
                    until={waitingTime}
                    timetoShow={['M', 'S']}
                    digitStyle={{backgroundColor: '#ddd'}}
                    digitTxtStyle={{color: '#555'}}
                    timeLabelStyle={{color: '#ddd'}}
                    size={12}
                    onFinish={() => setShowSendAgain(true)}
                  />
                </>
              )}
            </View>
          </View>
        )}
      </Modalize>
      <Modalize
        ref={modalPassword}
        modalHeight={WINDOW_HEIGHT * 0.7}
        modalStyle={{flex: 1, zIndex: 3}}>
        {loading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={{flex: 1, padding: 16}}>
            <Text
              style={{
                marginTop: 16,
                fontWeight: 'bold',
                fontSize: 24,
                width: WINDOW_WIDTH * 0.8,
              }}>
              Login Dengan Password
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text>Atau </Text>
              <TouchableOpacity
                onPress={() => {
                  sendOTP(phone.value).then(r => {
                    if (!r) {
                      RNToasty.Success({
                        title: r.data.message,
                        position: 'bottom',
                      });
                    }
                  });
                  modalPassword.current?.close();
                  setShowSendAgain(false);
                  setWaitingTime(60 * 2);
                  modalOTP.current?.open();
                }}>
                <Text style={{color: colors.primary, fontWeight: 'bold'}}>
                  login dengan OTP
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword({value: text, error: ''})}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
              />
              <Button
                mode="contained"
                style={{width: '100%', marginVertical: 10, zIndex: 0}}
                labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
                onPress={_onPasswordSubmit}
                disabled={!showSendAgain}>
                Log In
              </Button>
            </View>
          </View>
        )}
      </Modalize>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: colors.grayDark,
  },
  link: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 0,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 1,
  },
  underlineStyleHighLighted: {
    borderColor: colors.primary,
  },
});

export default memo(Login);
