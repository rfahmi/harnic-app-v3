import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {Dimensions, Platform, ScrollView, Text, View} from 'react-native';
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
import {useDispatch} from 'react-redux';
import {setCart} from '../configs/redux/action/cartActions';
import {colors} from '../constants/colors';
import {isLogin} from '../utils/auth';
import {addCart} from '../utils/cart';

const FooterBuy = ({item, openModal}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const _handleChat = () => {
    navigation.push('SearchWebView', {
      title: 'Harnic Care',
      url: 'https://tawk.to/chat/5d79fce5c22bdd393bb57440/default',
    });
  };
  const _handleBuy = () => {
    isLogin().then((login) => {
      if (login) {
        addCart(item.itemid, 1, '', true).then((d) => {
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
  

  return (
    <>
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
            onPress={openModal}
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
