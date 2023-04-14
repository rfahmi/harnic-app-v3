import AsyncStorage from '@react-native-async-storage/async-storage';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import qs from 'qs';
import React, {memo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Button, IconButton} from 'react-native-paper';
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
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {
  emailValidator,
  passwordValidator,
  phoneValidator,
} from '../../utils/validator';
import {saveFcm} from '../../utils/fcm';
import Countdown from '../../components/Countdown';
// import CountDown from 'react-native-countdown-component';
const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const [waitingTime, setWaitingTime] = useState(0);
  const [showSendAgain, setShowSendAgain] = useState(true);
  const [mode, setMode] = useState(1);
  const [name, setName] = useState({value: null, error: ''});
  const [dob, setDob] = useState({value: null, error: ''});
  const [gender, setGender] = useState(1);
  const [phone, setPhone] = useState({value: null, error: ''});
  const [email, setEmail] = useState({value: null, error: ''});
  const [password, setPassword] = useState({value: null, error: ''});
  const [password2, setPassword2] = useState({value: null, error: ''});
  const [loading, setLoading] = useState(false);
  const [inputWidth, setInputWidth] = useState(300);
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const WINDOW_WIDTH = Dimensions.get('window').width;

  const modalOTP = useRef(null);
  const refDob = useRef(null);

  const _onRegPressed = () => {
    setLoading(true);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      setLoading(false);
      return;
    }
    if (password.value !== password2.value) {
      setPassword2({
        ...password2,
        error: 'Password tidak sama',
      });
      setLoading(false);
      return;
    }
    if (Platform.OS === 'android' && !dob.value) {
      setDob({
        ...dob,
        error: 'Tanggal lahir wajib diisi',
      });
      setLoading(false);
      return;
    }
    api
      .post(
        '/auth/signup/email',
        qs.stringify({
          username: name.value,
          email: email.value,
          password: password.value,
          dob: moment(dob.value).format('YYYY-MM-DD'),
          gender: gender === 1 ? 'Male' : 'Female',
        }),
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
  const _onRegPhonePressed = () => {
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
        console.log(res.data);
        setLoading(false);
        if (res.data.success) {
          if (!res.data.registered) {
            sendOTP(phone.value).then(r => {
              if (r) {
                setShowSendAgain(false);
                setWaitingTime(60 * 2);
                modalOTP.current?.open();
              }
            });
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
      .post(
        '/auth/signup/phone',
        qs.stringify({
          username: name.value,
          phone: phone.value,
          otp: code,
          dob: moment(dob.value).format('YYYY-MM-DD'),
          gender: gender === 1 ? 'Male' : 'Female',
        }),
      )
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

  return (
    <>
      <BackButton goBack={() => navigation.goBack()} />
      <ScrollView style={{padding: 16, flex: 1}}>
        <Background>
          <FocusAwareStatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />

          <View
            style={{paddingTop: '20%', marginBottom: 16, alignItems: 'center'}}>
            <Logo />

            <Header>Daftar sekarang, dapatkan penawaran terbaik</Header>
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
                onLayout={e => {
                  setInputWidth(e.nativeEvent.layout.width);
                }}
                label="Nama Lengkap"
                value={name.value}
                onChangeText={text => setName({value: text, error: ''})}
                error={!!name.error}
                errorText={name.error}
              />
              <TextInput
                label="Nomor HP"
                value={phone.value}
                onChangeText={text => setPhone({value: text, error: ''})}
                error={!!phone.error}
                errorText={phone.error}
                autoCapitalize="none"
                keyboardType="phone-pad"
              />
              {Platform.OS === 'android' && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TextInput
                      label="Tanggal Lahir"
                      value={
                        dob.value
                          ? moment(dob.value).format('MMMM D, YYYY')
                          : ''
                      }
                      error={!!dob.error}
                      errorText={dob.error}
                      onFocus={() => refDob.current.open()}
                      // disabled
                    />
                    <IconButton
                      icon="calendar"
                      onPress={() => refDob.current.open()}
                      color={colors.primary}
                      style={{
                        position: 'absolute',
                        top: 22,
                        bottom: 0,
                        right: 0,
                      }}
                    />
                  </View>
                  <View style={{marginVertical: 16}}>
                    <SwitchButton
                      onValueChange={val => setGender(val)} // this is necessary for this component
                      text1="Pria" // optional: first text in switch button --- default ON
                      text2="Wanita" // optional: second text in switch button --- default OFF
                      switchWidth={inputWidth} // optional: switch width --- default 44
                      switchHeight={60} // optional: switch height --- default 100
                      switchdirection="ltr" // optional: switch button direction ( ltr and rtl ) --- default ltr
                      switchBorderRadius={4} // optional: switch border radius --- default oval
                      switchSpeedChange={100} // optional: button change speed --- default 100
                      switchBorderColor="#d4d4d4" // optional: switch border color --- default #d4d4d4
                      switchBackgroundColor="#fff" // optional: switch background color --- default #fff
                      btnBorderColor={colors.grayLight} // optional: button border color --- default #00a4b9
                      btnBackgroundColor={
                        gender === 1 ? colors.blue : colors.pink
                      } // optional: button background color --- default #00bcd4
                      fontColor="#b1b1b1" // optional: text font color --- default #b1b1b1
                      activeFontColor="#fff" // optional: active font color --- default #fff
                    />
                  </View>
                </>
              )}

              <Button
                style={{width: '100%', marginVertical: 10, zIndex: 0}}
                labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
                disabled={!showSendAgain || loading}
                loading={loading && <ActivityIndicator size="small" />}
                mode="contained"
                onPress={_onRegPhonePressed}>
                {showSendAgain ? 'Daftar Sekarang' : 'Coba Lagi Nanti'}
              </Button>
            </>
          ) : (
            <>
              <TextInput
                onLayout={e => {
                  setInputWidth(e.nativeEvent.layout.width);
                }}
                label="Nama Lengkap"
                value={name.value}
                onChangeText={text => setName({value: text, error: ''})}
                error={!!name.error}
                errorText={name.error}
              />
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
                textContentType="newPassword"
              />
              <TextInput
                label="Ulangi Password"
                returnKeyType="done"
                value={password2.value}
                onChangeText={text => setPassword2({value: text, error: ''})}
                error={!!password2.error}
                errorText={password2.error}
                secureTextEntry
                textContentType="newPassword"
              />
              {Platform.OS === 'android' && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TextInput
                      label="Tanggal Lahir"
                      value={
                        dob.value
                          ? moment(dob.value).format('MMMM D, YYYY')
                          : ''
                      }
                      error={!!dob.error}
                      errorText={dob.error}
                      onFocus={() => refDob.current.open()}
                      // disabled
                    />
                    <IconButton
                      icon="calendar"
                      onPress={() => refDob.current.open()}
                      color={colors.primary}
                      style={{
                        position: 'absolute',
                        top: 22,
                        bottom: 0,
                        right: 0,
                      }}
                    />
                  </View>

                  <View style={{marginVertical: 16}}>
                    <SwitchButton
                      onValueChange={val => setGender(val)} // this is necessary for this component
                      text1="Pria" // optional: first text in switch button --- default ON
                      text2="Wanita" // optional: second text in switch button --- default OFF
                      switchWidth={inputWidth} // optional: switch width --- default 44
                      switchHeight={60} // optional: switch height --- default 100
                      switchdirection="ltr" // optional: switch button direction ( ltr and rtl ) --- default ltr
                      switchBorderRadius={0} // optional: switch border radius --- default oval
                      switchSpeedChange={100} // optional: button change speed --- default 100
                      switchBorderColor="#d4d4d4" // optional: switch border color --- default #d4d4d4
                      switchBackgroundColor="#fff" // optional: switch background color --- default #fff
                      btnBorderColor={colors.grayLight} // optional: button border color --- default #00a4b9
                      btnBackgroundColor={
                        gender === 1 ? colors.blue : colors.pink
                      } // optional: button background color --- default #00bcd4
                      fontColor="#b1b1b1" // optional: text font color --- default #b1b1b1
                      activeFontColor="#fff" // optional: active font color --- default #fff
                    />
                  </View>
                </>
              )}

              <Button
                style={{width: '100%', marginVertical: 10, zIndex: 0}}
                labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
                disabled={loading}
                loading={loading && <ActivityIndicator size="small" />}
                mode="contained"
                onPress={_onRegPressed}>
                Daftar Sekarang
              </Button>
            </>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.link}>Log In</Text>
            </TouchableOpacity>
          </View>
        </Background>
      </ScrollView>
      <Modalize
        ref={refDob}
        modalHeight={250}
        modalStyle={{flex: 1, zIndex: 3}}>
        <>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <DatePicker
              androidVariant="nativeAndroid"
              mode="date"
              date={dob.value || new Date()}
              onDateChange={e => setDob({value: e, error: ''})}
            />
          </View>
          <Button
            style={{
              backgroundColor: '#1100BB',
              margin: 16,
            }}
            mode="contained"
            onPress={() => {
              refDob.current.close();
            }}>
            OK
          </Button>
        </>
      </Modalize>
      <Modalize
        ref={modalOTP}
        modalHeight={WINDOW_HEIGHT * 0.7}
        modalStyle={{flex: 1, zIndex: 3}}>
        {loading ? (
          <View
            style={{
              height: WINDOW_HEIGHT * 0.7,
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
                  onPress={_onRegPhonePressed}
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
    </>
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

export default memo(Register);
