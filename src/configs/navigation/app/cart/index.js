import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Cart from '../../../../screens/cart';
const Stack = createStackNavigator();

const CartStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default CartStack;
