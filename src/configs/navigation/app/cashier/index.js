import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Cashier from '../../../../screens/cashier';
import CashierScan from '../../../../screens/cashier/CashierScan';
import CashierReceipt from '../../../../screens/cashier/CashierReceipt';
import CashierPayment from '../../../../screens/cashier/CashierPayment';
const Stack = createStackNavigator();

const CashierStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cashier" component={Cashier} />
      <Stack.Screen name="CashierScan" component={CashierScan} />
      <Stack.Screen name="CashierReceipt" component={CashierReceipt} />
      <Stack.Screen name="CashierPayment" component={CashierPayment} />
    </Stack.Navigator>
  );
};

export default CashierStack;
