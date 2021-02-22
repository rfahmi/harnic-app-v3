import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';

const CartCounter = ({style}) => {
  const cart = useSelector((state) => state.cart);
  return (
    <>
      {cart && cart.length > 0 && (
        <View
          style={[
            {
              backgroundColor: 'orange',
              borderRadius: 20,
              width: 16,
              height: 16,
              aspectRatio: 1 / 1,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              top: -6,
              right: -6,
            },
            style,
          ]}>
          <Text style={{color: '#fff', fontSize: 10}}>
            {(cart && cart.length) || 0}
          </Text>
        </View>
      )}
    </>
  );
};

export default memo(CartCounter);
