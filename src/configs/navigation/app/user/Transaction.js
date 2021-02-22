import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UserTransaction from '../../../../screens/user/transaction';
import TransactionView from '../../../../screens/user/transaction/TransactionView';
import TransactionReview from '../../../../screens/user/transaction/TransactionReview';
import Payment from './Payment';
const Stack = createStackNavigator();

const TransactionStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="UserTransaction" component={UserTransaction} />
      <Stack.Screen name="TransactionView" component={TransactionView} />
      <Stack.Screen name="TransactionReview" component={TransactionReview} />
      <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
};

export default TransactionStack;
