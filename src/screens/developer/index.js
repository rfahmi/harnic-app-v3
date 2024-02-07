import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {List, TextInput} from 'react-native-paper';
import {FacebookWebView} from '../../components/FacebookWebView';
import HeaderBack from '../../components/HeaderBack';
import {colors} from '../../constants/colors';
import {Modalize} from 'react-native-modalize';
import {NativeModules} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import HarnicToast from '@components/HarnicToast';

const Developer = ({navigation}) => {
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const modalOTP = useRef(null);
  const webviewModal = useRef(null);
  const [fcm, setFcm] = useState(null);

  const [webviewUrl, setWebviewUrl] = useState('https://harnic.id');
  const [deeplink, setDeeplink] = useState('harnic://transaction/JL2202240006');
  useEffect(() => {
    const getFcm = async () => {
      setFcm(await AsyncStorage.getItem('fcm_token'));
    };
    getFcm();
  }, []);
  return (
    <>
      <HeaderBack search={false} title="Developer" />
      <FacebookWebView
        ref={webviewModal}
        uri={webviewUrl}
        onClose={() => console.log('closed')}
      />
      <KeyboardAvoidingView behavior="height">
        <ScrollView>
          <List.Item
            title="Clipboard and Toast"
            onPress={() => {
              Clipboard.setString('Hello World!');
              HarnicToast.Show({title: 'Copied text', position: 'bottom'});
            }}
          />
          <List.Item
            title="Open Dev Menu"
            onPress={() => NativeModules.DevMenu.show()}
          />
          <List.Item
            title="Goto Test Panel"
            onPress={() =>
              navigation.navigate('HomePanel', {
                name: 2,
              })
            }
          />
          <List.Item
            title="Goto Test Page"
            onPress={() =>
              navigation.navigate('HomePage', {
                name: 'test',
              })
            }
          />
          <Text>Your FCM Token</Text>
          <TextInput
            style={{marginTop: 4}}
            value={fcm}
            mode="outlined"
            selectTextOnFocus
          />
          <Text>Test Webview</Text>
          <TextInput
            style={{marginVertical: 4}}
            value={webviewUrl}
            onChangeText={e => setWebviewUrl(e)}
            mode="outlined"
            returnKeyLabel="Go"
            selectTextOnFocus
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#aaa',
              padding: 16,
              margin: 4,
              color: '#fff',
              borderRadius: 8,
            }}
            onPress={() => webviewModal.current?.open()}>
            <Text>Open PopUp Webview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#aaa',
              padding: 16,
              margin: 4,
              color: '#fff',
              borderRadius: 8,
            }}
            onPress={() =>
              navigation.push('Search', {
                screen: 'SearchWebView',
                params: {
                  title: 'Webview Test',
                  url: webviewUrl,
                },
              })
            }>
            <Text>Open Normal Webview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#aaa',
              padding: 16,
              margin: 4,
              color: '#fff',
              borderRadius: 8,
            }}
            onPress={() =>
              navigation.push('Search', {
                screen: 'Product',
                params: {itemid: 1},
              })
            }>
            <Text>Open Product ID:1</Text>
          </TouchableOpacity>
          <TextInput
            style={{marginVertical: 4}}
            value={deeplink}
            onChangeText={e => setDeeplink(e)}
            mode="outlined"
            returnKeyLabel="Go"
            selectTextOnFocus
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#aaa',
              padding: 16,
              margin: 4,
              color: '#fff',
              borderRadius: 8,
            }}
            onPress={() => {
              try {
                Linking.openURL(deeplink);
              } catch (error) {
                alert.apply(error.message);
              }
            }}>
            <Text>Open Deeplink</Text>
          </TouchableOpacity>
          <TextInput
            style={{marginVertical: 4}}
            value=""
            onChangeText={e => modalOTP.current?.open()}
            mode="outlined"
            returnKeyLabel="Go"
            selectTextOnFocus
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#aaa',
              padding: 16,
              margin: 4,
              color: '#fff',
              borderRadius: 8,
            }}
            onPress={() => {
              Keyboard.dismiss();
              modalOTP.current?.open();
            }}>
            <Text>Open OTP</Text>
          </TouchableOpacity>
        </ScrollView>
        <Modalize
          ref={modalOTP}
          modalHeight={WINDOW_HEIGHT * 0.5}
          modalStyle={{flex: 1, zIndex: 3}}>
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
            <View style={{alignItems: 'center'}}>
              <OTPInputView
                style={{width: '70%', height: 200}}
                pinCount={4}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={code => {
                  console.log(code);
                }}
              />
            </View>
          </View>
        </Modalize>
      </KeyboardAvoidingView>
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
export default Developer;
