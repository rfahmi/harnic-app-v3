import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Feed from '../../../../screens/feed';
const Stack = createStackNavigator();

const FeedStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Feed" component={Feed} />
    </Stack.Navigator>
  );
};

export default FeedStack;
