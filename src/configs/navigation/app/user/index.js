import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import User from '../../../../screens/user';
import UserData from '../../../../screens/user/data';
import UserPassword from '../../../../screens/user/password';
import UserCard from '../../../../screens/user/card';
import UserVoucher from '../../../../screens/user/voucher';
import UserNotification from '../../../../screens/user/notification';
import UserPoint from '../../../../screens/user/point';
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
    </Stack.Navigator>
  );
};

export default UserStack;
