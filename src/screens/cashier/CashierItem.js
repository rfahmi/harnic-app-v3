import React, {useEffect, useState} from 'react';
import {Platform, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, IconButton, List} from 'react-native-paper';
import {colors} from '../../constants/colors';
import {deleteCart} from '../../utils/cart';
import {currencyFormat} from '../../utils/formatter';

const CashierItem = ({item, edit, onUpdateQty, onDelete}) => {
  const [data, setData] = useState(item);

  const minCart = () => {
    const newQty = Number(data.qty) - 1;
    // return updateCart(data.itemmst, newQty, null, false);
    onUpdateQty(data.itemmst, newQty);
  };
  const plusCart = () => {
    const newQty = Number(data.qty) + 1;
    // return updateCart(data.itemmst, newQty, null, false);
    onUpdateQty(data.itemmst, newQty);
  };

  useEffect(() => {
    setData(item);
  }, [item]);

  return (
    <>
      <List.Item
        title={data.online_name}
        titleStyle={{fontSize: 12}}
        titleNumberOfLines={2}
        description={
          <View style={{paddingVertical: 8}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: 'orange',
                }}>
                Rp{currencyFormat(data.price)}
              </Text>
              {data.is_discount === 0 ? (
                <View
                  style={{
                    borderRadius: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#e63757',
                    paddingVertical: 2,
                    paddingHorizontal: 4,
                    marginLeft: 8,
                  }}>
                  <Text style={{fontSize: 8, color: '#fff'}}>No Discount</Text>
                </View>
              ) : (
                <View />
              )}
            </View>
            <Text
              style={{
                fontSize: 11,
                marginTop: 8,
              }}>
              Subtotal: Rp{currencyFormat(data.subtotal)}
            </Text>
            {data.note ? (
              <Text
                style={{
                  fontSize: 10,
                  color: '#393836',
                  backgroundColor: '#FEF4C5',
                }}
                ellipsizeMode="clip">
                Catatan: {data.note}
              </Text>
            ) : (
              <View />
            )}
          </View>
        }
        left={() => (
          <View style={{justifyContent: 'center'}}>
            <View
              style={{
                width: 72,
                aspectRatio: 1 / 1,
                elevation: 1,
              }}>
              <FastImage
                source={{
                  uri: Platform.OS === 'ios' ? data.picture_ios : data.picture,
                }}
                style={{flex: 1, backgroundColor: '#eee', borderRadius: 1}}
              />
            </View>
          </View>
        )}
        right={() => (
          <View style={{justifyContent: 'center'}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <IconButton
                onPress={() => minCart()}
                disabled={data.qty < 2}
                color={colors.primary}
                icon="minus-circle"
              />
              <Text>{data.qty}</Text>
              <IconButton
                onPress={() => plusCart()}
                disabled={
                  data.max_order > 0 &&
                  (data.qty >= data.max_order || data.qty >= data.stock)
                }
                color={colors.primary}
                icon="plus-circle"
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <IconButton
                mode="outlined"
                onPress={() => {
                  onDelete(data.itemmst);
                }}
                color={colors.red}
                icon="delete"
              />
            </View>
          </View>
        )}
      />
      <Divider />
    </>
  );
};

export default CashierItem;
