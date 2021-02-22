import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UserShipping from '../../../../screens/user/shipping';
import UserShippingAdd from '../../../../screens/user/shipping/AddShipping';
import UserShippingEdit from '../../../../screens/user/shipping/EditShipping';
const Stack = createStackNavigator();

const UserShippingStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="UserShipping" component={UserShipping} />
      <Stack.Screen name="UserShippingAdd" component={UserShippingAdd} />
      <Stack.Screen name="UserShippingEdit" component={UserShippingEdit} />
    </Stack.Navigator>
  );
};

export default UserShippingStack;
