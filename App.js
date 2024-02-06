import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Platform} from 'react-native';
import 'react-native-gesture-handler';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import PushNotification from 'react-native-push-notification';
import {Provider as ReduxProvider} from 'react-redux';
import RootStack from './src/configs/navigation';
import {store} from './src/configs/redux';
import {colors} from './src/constants/colors';
import {saveFcm} from './src/utils/fcm';
import * as RootNavigation from './src/utils/RootNavigation';
import {Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ToastProvider} from 'react-native-toast-notifications';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: async function (token) {
    // console.log('TOKEN:', token);
    await AsyncStorage.setItem('fcm_token', token.token);
    saveFcm(token.token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    // console.log('onNotification NOTIFICATION:', notification);

    // process the notification
    notification.userInteraction &&
      AsyncStorage.getItem('user_data').then(e => {
        e = JSON.parse(e);
        RootNavigation.navigate('App', {
          screen: 'User',
          params: {screen: 'UserNotification', params: {user_id: e.user_id}},
        });
      });

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    // console.log('onAction ACTION:', notification.action);
    // console.log('onAction NOTIFICATION:', notification);
    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: Platform.OS === 'ios',
});
PushNotification.channelExists('general', function (exists) {
  if (!exists) {
    PushNotification.createChannel(
      {
        channelId: 'general', // (required)
        channelName: 'General', // (required)
        channelDescription: 'General notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }
});

const App = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
    },
  };

  const config = {
    screens: {
      Transaction: {
        screens: {
          TransactionView: {
            path: 'transaction/:trxno',
          },
        },
      },
      Search: {
        screens: {
          Product: {
            path: 'product/:itemid',
          },
        },
      },
      HomePage: {
        path: 'url/:name',
      },
    },
  };

  const linking = {
    prefixes: ['harnic://', 'https://harnic.id', 'https://www.harnic.id'],
    config,
  };
  return (
    <ToastProvider>
      <ReduxProvider store={store}>
        <PaperProvider
          settings={{
            icon: props => <MaterialCommunityIcons {...props} />,
          }}
          theme={theme}>
          <NavigationContainer
            ref={RootNavigation.navigationRef}
            linking={linking}
            fallback={<Text>Loading...</Text>}>
            <RootStack />
          </NavigationContainer>
        </PaperProvider>
      </ReduxProvider>
    </ToastProvider>
  );
};

export default App;
