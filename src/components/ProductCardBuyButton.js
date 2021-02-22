import {useNavigation} from '@react-navigation/native';
import React, {memo, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import {useDispatch, useSelector} from 'react-redux';
import {setCart, setCount} from '../configs/redux/action/cartActions';
import {colors} from '../constants/colors';
import {isLogin} from '../utils/auth';
import {addCart, deleteCart, updateCart} from '../utils/cart';

const ProductCardBuyButton = ({id, containerStyle, maxOrder, stock = 999}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartSelector = useSelector((state) => state.cart);

  const [find, setFind] = useState(
    cartSelector && cartSelector.find((e) => String(e.itemmst) === String(id)),
  );
  const [qty, setQty] = useState(find ? find.qty : 0);
  const [isAdded, setAdded] = useState(find);

  useEffect(() => {
    const new_cart =
      cartSelector &&
      cartSelector.find((e) => String(e.itemmst) === String(id));
    setFind(new_cart);
    if (new_cart) {
      setQty(new_cart.qty);
    } else {
      setQty(0);
      setAdded(false);
    }
  }, [cartSelector]);

  const newCart = () => {
    isLogin().then((res) => {
      if (res) {
        const newQty = Number(qty) + 1;
        setQty(newQty);
        addCart(id, newQty, '', true).then((d) => {
          d && dispatch(setCart(d));
        });
        setAdded(true);
      } else {
        navigation.navigate('Auth');
        RNToasty.Error({
          title: 'Login Untuk Belanja',
          position: 'center',
        });
      }
    });
  };

  const minCart = () => {
    isLogin().then((res) => {
      if (res) {
        const newQty = Number(qty) - 1;
        if (newQty > 0) {
          setQty(newQty);
          updateCart(id, newQty, false).then((d) => {
            d && dispatch(setCart(d));
          });
          setAdded(true);
        } else {
          setQty(0);
          deleteCart(id, false).then((d) => {
            d && dispatch(setCart(d));
          });
          setAdded(false);
        }
      } else {
        navigation.navigate('Auth');
        RNToasty.Error({
          title: 'Login Untuk Belanja',
          position: 'center',
        });
      }
    });
  };
  const plusCart = () => {
    isLogin().then((res) => {
      if (res) {
        const newQty = Number(qty) + 1;
        setQty(newQty);
        updateCart(id, newQty, false);
        setAdded(true);
      } else {
        navigation.navigate('Auth');
        RNToasty.Error({
          title: 'Login Untuk Belanja',
          position: 'center',
        });
      }
    });
  };

  const toastMax = () => {
    RNToasty.Error({
      title: `Batas Beli ${maxOrder}`,
      position: 'center',
    });
  };
  const toastStock = () => {
    RNToasty.Error({
      title: `Sisa stok ${stock}`,
      position: 'center',
    });
  };

  return (
    <View style={containerStyle}>
      {isAdded ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            height: 28,
          }}>
          <IconButton
            onPress={minCart}
            icon="minus-circle"
            size={22}
            color={colors.green}
          />
          <Text>{qty}</Text>
          <IconButton
            onPress={
              qty < maxOrder ? (stock > qty ? plusCart : toastStock) : toastMax
            }
            icon="plus-circle"
            size={22}
            color={colors.green}
          />
        </View>
      ) : (
        <Button
          disabled={Number(stock) < 1}
          mode="contained"
          icon="plus"
          color={colors.green}
          // contentStyle={{ height: 28}}
          // labelStyle={{fontSize: 12}}
          style={{flex: 1}}
          uppercase={false}
          onPress={newCart}>
          Beli
        </Button>
      )}
    </View>
  );
};

export default memo(ProductCardBuyButton);
