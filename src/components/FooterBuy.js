import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, View, Linking} from 'react-native';
import {Appbar, Button, IconButton} from 'react-native-paper';
import HarnicToast from '@components/HarnicToast';
import {useDispatch} from 'react-redux';
import {setCart} from '../configs/redux/slice/cartSlice';
import {colors} from '../constants/colors';
import {isLogin} from '../utils/auth';
import {addCart} from '../utils/cart';

const FooterBuy = ({item, openModal}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const _handleChat = () => {
    // navigation.push('SearchWebView', {
    //   title: 'Harnic Care',
    //   url: 'https://tawk.to/chat/5d79fce5c22bdd393bb57440/default',
    // });
    Linking.openURL('https://wa.me/6282166001212');
  };
  const _handleBuy = () => {
    setLoading(true);
    isLogin().then((login) => {
      if (login) {
        addCart(item.itemid, 1, '', true).then((d) => {
          navigation.navigate('App', {screen: 'Cart'});
          d && dispatch(setCart(d));
        });
        setLoading(false);
      } else {
        setLoading(false);
        navigation.navigate('Auth');
        HarnicToast.Show({
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
            loading={loading && <ActivityIndicator size="small" />}
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
