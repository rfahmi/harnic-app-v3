import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Cashier from '../../../../screens/cashier';
import CashierScan from '../../../../screens/cashier/CashierScan';
import CashierReceipt from '../../../../screens/cashier/CashierReceipt';
import CashierPayment from '../../../../screens/cashier/CashierPayment';
import CashierTrxList from '../../../../screens/cashier/CashierTrxList';
const Stack = createStackNavigator();

const CashierStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cashier"
        options={{title: 'Waling Cashier'}}
        component={Cashier}
      />
      <Stack.Screen
        name="CashierScan"
        options={{title: 'Scan'}}
        component={CashierScan}
      />
      <Stack.Screen
        name="CashierTrxList"
        options={{title: 'Riwayat Transaksi'}}
        component={CashierTrxList}
      />
      <Stack.Screen
        name="CashierReceipt"
        options={{title: 'Receipt'}}
        component={CashierReceipt}
      />
      <Stack.Screen
        name="CashierPayment"
        options={{title: 'Pembayaran'}}
        component={CashierPayment}
      />
    </Stack.Navigator>
  );
};

export default CashierStack;
