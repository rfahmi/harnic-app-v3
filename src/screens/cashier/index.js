import React, {useEffect, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCartItems,
  updateCartItemQuantity,
} from '../../configs/redux/slice/cashierSlice';
import Empty from '../../organism/empty';
import CashierItem from './CashierItem';
import Button from '../../components/Button';

const Cashier = ({navigation}) => {
  const dispatch = useDispatch();
  const {cart, loading, error} = useSelector(state => state.cashier);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const _handleRefresh = () => {
    dispatch(getCartItems());
  };

  const _handleUpdateQty = (itemid, qty) => {
    dispatch(updateCartItemQuantity({itemid, qty}));
  };

  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push('Search', {
            screen: 'Product',
            params: {itemid: item.itemmst},
          })
        }>
        <CashierItem item={item} onUpdateQty={_handleUpdateQty} />
      </TouchableOpacity>
    );
  };
  const keyExtractor = (item, index) => {
    return String('Cart' + index + item.item_id);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1}}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        contentContainerStyle={{backgroundColor: '#fff', flex: 1}}
        ListEmptyComponent={
          !loading && (
            <Empty
              image="shopping"
              title="Belum Ada Produk"
              caption="Tambahkan beberapa produk"
            />
          )
        }
        data={cart}
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
      />
      <Button
        mode="contained"
        onPress={() => navigation.push('CashierReceipt')}>
        Buat Receipt
      </Button>
    </KeyboardAvoidingView>
  );
};

export default Cashier;
