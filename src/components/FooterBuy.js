import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Modalize} from 'react-native-modalize';
import {
  Appbar,
  Button,
  IconButton,
  List,
  TextInput,
  Title,
} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import {useDispatch, useSelector} from 'react-redux';
import {setCart} from '../configs/redux/action/cartActions';
import {colors} from '../constants/colors';
import VariantProducts from '../organism/product/VariantProducts';
import {isLogin} from '../utils/auth';
import {addCart} from '../utils/cart';
import {currencyFormat} from '../utils/formatter';

const FooterBuy = ({item}) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const cartModal = useRef(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState(null);
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const _handleChat = () => {
    navigation.push('SearchWebView', {
      title: 'Harnic Care',
      url: 'https://tawk.to/chat/5d79fce5c22bdd393bb57440/default',
    });
  };
  const _handleBuy = () => {
    isLogin().then((login) => {
      if (login) {
        addCart(item.itemid, qty, '', true).then((d) => {
          d && dispatch(setCart(d));
          navigation.navigate('App', {screen: 'Cart'});
        });
      } else {
        navigation.navigate('Auth');
        RNToasty.Error({
          title: 'Login Untuk Belanja',
          position: 'center',
        });
      }
    });
  };
  const _handleAddCart = () => {
    isLogin().then((login) => {
      if (login) {
        addCart(item.itemid, qty, note, true).then((d) => {
          d && dispatch(setCart(d));
          cartModal.current?.close();
        });
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
      <Modalize
        ref={cartModal}
        modalHeight={WINDOW_HEIGHT * 0.5}
        modalStyle={{flex: 1, paddingHorizontal: 16}}>
        <ScrollView style={{paddingVertical: 16}}>
          <Title>Tambah ke keranjang</Title>
          <List.Item
            // style={{height: 200}}
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
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: 'orange',
                      }}>
                      Rp
                      {item &&
                        currencyFormat(item[auth.priceType] || item.sellprice)}
                    </Text>
                  </View>
                  {item.is_discount ? (
                    <View
                      style={{
                        flex: 1,
                        borderRadius: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#e63757',
                        paddingVertical: 2,
                        paddingHorizontal: 4,
                        marginLeft: 8,
                      }}>
                      <Text style={{fontSize: 8, color: '#fff'}}>
                        No Discount
                      </Text>
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
                  Subtotal: Rp{currencyFormat(item.sellprice * qty)}
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
                    source={{uri: item.picture}}
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
                  }}>
                  <IconButton
                    onPress={() => setQty(qty - 1)}
                    disabled={qty < 2}
                    color={colors.primary}
                    icon="minus-circle"
                  />
                  <Text>{qty}</Text>
                  <IconButton
                    onPress={() => setQty(qty + 1)}
                    disabled={qty >= item.max_order || qty >= item.stock}
                    color={colors.primary}
                    icon="plus-circle"
                  />
                </View>
                {item.max_order < 9999 && (
                  <View
                    style={{
                      borderRadius: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#e63757',
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      marginLeft: 8,
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
          {item.variants && <VariantProducts items={item.variants} />}
        </ScrollView>
        <Button
          onPress={_handleAddCart}
          style={{margin: 4, flex: 1, marginVertical: 10}}
          labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
          color={colors.primary}
          mode="contained">
          Tambah Keranjang
        </Button>
      </Modalize>
      <Appbar
        style={{
          backgroundColor: '#fff',
          elevation: 0,
          height: 48,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconButton
            style={{margin: 4}}
            labelStyle={{fontSize: 10}}
            color={colors.primary}
            icon="message-outline"
            onPress={_handleChat}
          />
          <Button
            onPress={_handleBuy}
            style={{margin: 4, flex: 1}}
            labelStyle={{fontSize: 10}}
            color={colors.primary}
            mode="contained">
            Langsung Beli
          </Button>
          <Button
            onPress={() => cartModal.current?.open()}
            style={{margin: 4, flex: 1}}
            labelStyle={{fontSize: 10}}
            color={colors.primary}
            mode="outlined">
            Tambah Keranjang
          </Button>
        </View>
      </Appbar>
    </>
  );
};

export default FooterBuy;
