import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Checkout from '../../../screens/checkout';
const Stack = createStackNavigator();

const CheckoutStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{title: 'Pilih Pengiriman', headerBackTitle: 'Keranjang'}}
      />
    </Stack.Navigator>
  );
};

export default CheckoutStack;
