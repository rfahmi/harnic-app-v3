import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../constants/colors';
import Home from './home';
import Shoplist from './shoplist';
import Cart from './cart';
import User from './user';
import Feed from './feed';
import CartCounter from '../../../components/CartCounter';

const Tab = createMaterialBottomTabNavigator();

const AppStack = () => {
  return (
    <Tab.Navigator
      headerMode="none"
      shifting={false}
      backBehavior="history"
      initialRouteName="Home"
      activeColor={colors.primary}
      inactiveColor={colors.gray}
      barStyle={{backgroundColor: '#fff'}}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => <Icon name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Shoplist"
        component={Shoplist}
        options={{
          tabBarLabel: 'Shoplist',
          tabBarIcon: ({color}) => (
            <Icon name="shopping" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({color}) => (
            <Icon name="checkbox-multiple-blank" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({color}) => (
            <>
              <Icon name="cart" color={color} size={26} />
              <CartCounter />
            </>
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={User}
        options={{
          tabBarLabel: 'User',
          tabBarIcon: ({color}) => (
            <Icon name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
