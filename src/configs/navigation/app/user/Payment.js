import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Payment from '../../../../screens/user/transaction/payment';
import Pay from '../../../../screens/user/transaction/payment/Pay';
const Stack = createStackNavigator();

const PaymentStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Pay" component={Pay} />
    </Stack.Navigator>
  );
};

export default PaymentStack;
