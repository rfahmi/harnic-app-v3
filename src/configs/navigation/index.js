import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Platform} from 'react-native';
import Developer from '../../screens/developer';
import HomePage from '../../screens/home/HomePage';
import HomePanel from '../../screens/home/HomePanel';
import Splash from '../../screens/splash';
import Maintenance from '../../screens/splash/Maintenance';
import AppStack from './app';
import TransactionStack from './app/user/Transaction';
import UserShippingStack from './app/user/UserShipping';
import AuthStack from './auth';
import CheckoutStack from './checkout';
import SearchStack from './search';

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      {Platform.OS === 'android' && (
        <Stack.Screen name="Splash" component={Splash} />
      )}
      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen name="Maintenance" component={Maintenance} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Search" component={SearchStack} />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="HomePanel" component={HomePanel} />
      <Stack.Screen name="Checkout" component={CheckoutStack} />
      <Stack.Screen name="Transaction" component={TransactionStack} />
      <Stack.Screen name="UserShipping" component={UserShippingStack} />
      <Stack.Screen name="Developer" component={Developer} />
    </Stack.Navigator>
  );
};

export default RootStack;
