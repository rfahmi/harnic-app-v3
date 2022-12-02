import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Billing from '../../../../screens/billing';
import BillingCheckout from '../../../../screens/billing/BillingCheckout';
import BillingProducts from '../../../../screens/billing/BillingProducts';
const Stack = createStackNavigator();

const BillingStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Billing" component={Billing} />
      <Stack.Screen name="BillingProducts" component={BillingProducts} />
      <Stack.Screen name="BillingCheckout" component={BillingCheckout} />
    </Stack.Navigator>
  );
};

export default BillingStack;
