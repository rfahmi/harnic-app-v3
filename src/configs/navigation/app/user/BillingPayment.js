import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BillingPayment from '../../../../screens/user/billing/payment';
import BillingPay from '../../../../screens/user/billing/payment/Pay';
const Stack = createStackNavigator();

const BillingPaymentStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="BillingPayment" component={BillingPayment} />
      <Stack.Screen name="BillingPay" component={BillingPay} />
    </Stack.Navigator>
  );
};

export default BillingPaymentStack;
