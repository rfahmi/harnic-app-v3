import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UserBilling from '../../../../screens/user/billing';
import BillingView from '../../../../screens/user/billing/BillingView';
import BillingPayment from './BillingPayment';
const Stack = createStackNavigator();

const BillingStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="UserBilling" component={UserBilling} />
      <Stack.Screen name="BillingView" component={BillingView} />
      <Stack.Screen name="BIllingPayment" component={BillingPayment} />
    </Stack.Navigator>
  );
};

export default BillingStack;
