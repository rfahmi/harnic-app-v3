import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {List, TextInput} from 'react-native-paper';
import {FacebookWebView} from '../../components/FacebookWebView';
import HeaderBack from '../../components/HeaderBack';

const Developer = ({navigation}) => {
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
      <KeyboardAvoidingView style={{flex: 1}} behavior="height">
        <ScrollView style={{padding: 16}}>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Developer;
