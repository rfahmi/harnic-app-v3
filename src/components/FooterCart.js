import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {colors} from '../constants/colors';
import {currencyFormat} from '../utils/formatter';

const FooterCart = ({products, attribute}) => {
  const navigation = useNavigation();

  const total = products.reduce(
    (t, obj) => Number(obj.subtotal) + Number(t),
    0,
  );
  const total_slashed = products.reduce(
    (t, obj) => Number(obj.old_price) + Number(t),
    0,
  );
  const min_order = attribute.min_order || 30000;
  const _handleNext = () =>
    navigation.navigate('Checkout', {
      screen: 'Checkout',
      params: {total_item: total, total_item_slashed: total_slashed},
    });

  return (
    <>
      <View
        style={{
          zIndex: 1,
          borderTopColor: '#ccc',
          borderTopWidth: 0.5,
          backgroundColor: '#fff',
          padding: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <Text style={{color: 'black', fontSize: 10}}>Total Barang</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'orange'}}>
              Rp
              {currencyFormat(total)}
            </Text>
          </View>
          <View
            style={{
              flex: 2,
            }}>
            <Button
              disabled={total < min_order}
              onPress={_handleNext}
              style={{margin: 4}}
              labelStyle={{fontSize: 12, fontWeight: 'bold'}}
              color={colors.green}
              mode="contained">
              {total < min_order
                ? `Minimal Order Rp${currencyFormat(min_order)}`
                : 'Checkout'}
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};

export default FooterCart;
