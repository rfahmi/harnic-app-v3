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
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, List, TextInput} from 'react-native-paper';
import {FacebookWebView} from '../../components/FacebookWebView';
import HeaderBack from '../../components/HeaderBack';
import {colors} from '../../constants/colors';
import {Modalize} from 'react-native-modalize';
import {NativeModules} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import HarnicToast from '@components/HarnicToast';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {SafeAreaView} from 'react-native-safe-area-context';

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
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <HeaderBack search={false} title="Developer" />
      <FacebookWebView
        ref={webviewModal}
        uri={webviewUrl}
        onClose={() => console.log('closed')}
      />
      <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
        <ScrollView
          style={{flex: 1, flexDirection: 'column', paddingHorizontal: 16}}>
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
          <TextInput value={fcm} multiline mode="outlined" selectTextOnFocus />
          <Button
            mode="contained"
            style={{
              backgroundColor: '#aaa',
              color: '#fff',
              borderRadius: 8,
            }}
            onPress={() => {
              PushNotificationIOS.addNotificationRequest({
                id: 'test_notification',
                title: 'Test Notification',
                body: 'This is a test local notification',
              });
            }}>
            <Text>Trigger IOS LocalNotification</Text>
          </Button>

          <View style={{height: 16}} />
          <Text>Test Webview</Text>
          <TextInput
            value={webviewUrl}
            onChangeText={e => setWebviewUrl(e)}
            mode="outlined"
            returnKeyLabel="Go"
            selectTextOnFocus
          />
          <Button
            mode="contained"
            style={{
              backgroundColor: '#aaa',
              color: '#fff',
              borderRadius: 8,
            }}
            onPress={() => webviewModal.current?.open()}>
            <Text>Open PopUp Webview</Text>
          </Button>
          <Button
            mode="contained"
            style={{
              backgroundColor: '#aaa',
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
          </Button>
          <Button
            mode="contained"
            style={{
              backgroundColor: '#aaa',
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
          </Button>
          <TextInput
            value={deeplink}
            onChangeText={e => setDeeplink(e)}
            mode="outlined"
            returnKeyLabel="Go"
            selectTextOnFocus
          />
          <Button
            mode="contained"
            style={{
              backgroundColor: '#aaa',
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
          </Button>
          <TextInput
            value=""
            onChangeText={e => modalOTP.current?.open()}
            mode="outlined"
            returnKeyLabel="Go"
            selectTextOnFocus
          />
          <Button
            mode="contained"
            style={{
              backgroundColor: '#aaa',
              color: '#fff',
              borderRadius: 8,
            }}
            onPress={() => {
              Keyboard.dismiss();
              modalOTP.current?.open();
            }}>
            <Text>Open OTP</Text>
          </Button>
        </ScrollView>
        <Modalize
          ref={modalOTP}
          modalHeight={WINDOW_HEIGHT * 0.5}
          modalStyle={{flex: 1, zIndex: 3}}>
          <View style={{flex: 1, padding: 16}}>
            <Text
              style={{
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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
