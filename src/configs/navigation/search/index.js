import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Search from '../../../screens/search';
import SearchResult from '../../../screens/search/SearchResult';
import Product from '../../../screens/product';
import ProductReview from '../../../screens/product/ProductReview';
import SearchWebView from '../../../screens/search/SearchWebView';

const Stack = createStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchResult"
        component={SearchResult}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Product"
        component={Product}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductReview"
        component={ProductReview}
        options={{title: 'Ulasan Produk'}}
      />
      <Stack.Screen
        name="SearchWebView"
        component={SearchWebView}
        options={{headerShown: false, title: 'Loading'}}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;
