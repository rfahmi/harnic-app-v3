import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import User from '../../../../screens/user';
import UserCard from '../../../../screens/user/card';
import UserData from '../../../../screens/user/data';
import UserNotification from '../../../../screens/user/notification';
import UserPassword from '../../../../screens/user/password';
import UserPoint from '../../../../screens/user/point';
import UserVoucher from '../../../../screens/user/voucher';
import UserWarranty from '../../../../screens/user/warranty';
const Stack = createStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="UserData" component={UserData} />
      <Stack.Screen name="UserPassword" component={UserPassword} />
      <Stack.Screen name="UserCard" component={UserCard} />
      <Stack.Screen name="UserPoint" component={UserPoint} />
      <Stack.Screen name="UserVoucher" component={UserVoucher} />
      <Stack.Screen name="UserNotification" component={UserNotification} />
      <Stack.Screen name="UserWarranty" component={UserWarranty} />
    </Stack.Navigator>
  );
};

export default UserStack;
