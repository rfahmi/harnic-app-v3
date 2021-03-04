import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Splash from '../../screens/splash';
import AppStack from './app';
import AuthStack from './auth';
import SearchStack from './search';
import CheckoutStack from './checkout';
import TransactionStack from './app/user/Transaction';
import UserShippingStack from './app/user/UserShipping';
import HomePage from '../../screens/home/HomePage';
import HomePanel from '../../screens/home/HomePanel';
import {Platform} from 'react-native';

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      {Platform.OS === 'android' && (
        <Stack.Screen name="Splash" component={Splash} />
      )}
      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Search" component={SearchStack} />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="HomePanel" component={HomePanel} />
      <Stack.Screen name="Checkout" component={CheckoutStack} />
      <Stack.Screen name="Transaction" component={TransactionStack} />
      <Stack.Screen name="UserShipping" component={UserShippingStack} />
    </Stack.Navigator>
  );
};

export default RootStack;
