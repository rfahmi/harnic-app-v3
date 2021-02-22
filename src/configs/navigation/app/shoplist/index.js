import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Shoplist from '../../../../screens/shoplist';
const Stack = createStackNavigator();

const ShoplistStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Shoplist" component={Shoplist} />
    </Stack.Navigator>
  );
};

export default ShoplistStack;
