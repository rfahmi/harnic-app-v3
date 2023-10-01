import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {Text, View, TextInput as TextInputRN, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, IconButton, List, TextInput} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import {useDispatch} from 'react-redux';
import {setCart} from '../../configs/redux/slice/cartSlice';
import {colors} from '../../constants/colors';
import {isLogin} from '../../utils/auth';
import {updateCart} from '../../utils/cart';
import {currencyFormat} from '../../utils/formatter';

const CartItemEdit = ({item, closeModal}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartModal = useRef(null);
  const [qty, setQty] = useState(item.qty || 1);
  const [note, setNote] = useState(item.note || null);
  const _handleAddCart = () => {
    isLogin().then((login) => {
      if (login) {
        updateCart(item.itemid, qty, note, true).then((d) => {
          d && dispatch(setCart(d));
          cartModal.current?.close();
        });
        closeModal();
      } else {
        navigation.navigate('Auth');
        RNToasty.Error({
          title: 'Login Untuk Belanja',
          position: 'center',
        });
      }
    });
  };

  return (
    <>
      <List.Item
        title={item.online_name}
        titleStyle={{fontSize: 12}}
        titleNumberOfLines={2}
        description={
          <View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                paddingTop: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: 'orange',
                }}>
                Rp
                {item && currencyFormat(item.price)}
              </Text>
              {item.is_discount === 0 ? (
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
              Subtotal: Rp{currencyFormat(item.price * qty)}
            </Text>
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
                  uri: Platform.OS === 'ios' ? item.picture_ios : item.picture,
                }}
                style={{flex: 1, backgroundColor: '#eee', borderRadius: 1}}
              />
            </View>
          </View>
        )}
        right={() => (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                // borderStyle: 'dashed',
                // borderColor: '#aaa',
                // borderWidth: 1,
              }}>
              <IconButton
                onPress={() => setQty(qty - 1)}
                disabled={qty < 2}
                color={colors.primary}
                icon="minus-circle"
              />
              <TextInputRN
                value={String(qty || 0)}
                mode="flat"
                keyboardType="numeric"
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  borderBottomColor: '#aaa',
                  borderBottomWidth: 1,
                }}
                onChangeText={(e) =>
                  setQty(Number(e) > item.stock ? item.stock : Number(e))
                }
              />
              <IconButton
                onPress={() => setQty(qty + 1)}
                disabled={
                  item.max_order > 0 &&
                  (qty >= item.max_order || qty >= item.stock)
                }
                color={colors.primary}
                icon="plus-circle"
              />
            </View>
            {item.max_order < 999 && item.max_order > 0 && (
              <View
                style={{
                  borderRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#555',
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  margin: 2,
                }}>
                <Text style={{fontSize: 8, color: '#fff'}}>
                  Batas beli {item.max_order}
                </Text>
              </View>
            )}
            {item.stock < 10 && (
              <View
                style={{
                  borderRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#555',
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  margin: 2,
                }}>
                <Text style={{fontSize: 8, color: '#fff'}}>
                  Stock {item.stock}
                </Text>
              </View>
            )}
          </View>
        )}
      />
      <View>
        <TextInput
          style={{
            backgroundColor: '#FEF4C5',
            borderRadius: 10,
            flex: 1,
            borderColor: 'transparent',
          }}
          label="Catatan Produk"
          value={note}
          multiline
          mode="outlined"
          numberOfLines={3}
          placeholder="Catatan untuk produk ini (opsional)"
          onChangeText={(e) => setNote(e)}
        />
      </View>
      <Button
        onPress={_handleAddCart}
        style={{flex: 1, marginVertical: 10}}
        labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
        color={colors.primary}
        mode="contained">
        Ubah Produk
      </Button>
    </>
  );
};

export default CartItemEdit;
