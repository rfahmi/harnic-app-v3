import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FooterCart from '../../components/FooterCart';
import ScreenTitle from '../../components/ScreenTitle';
import CartItem from './CartItem';
import Empty from '../../organism/empty';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../../configs/api';
import {RNToasty} from 'react-native-toasty';
import {useDispatch, useSelector} from 'react-redux';
import {setCart} from '../../configs/redux/action/cartActions';
import {useIsFocused} from '@react-navigation/native';
import {colors} from '../../constants/colors';
import ProductCard from '../../components/ProductCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modalize} from 'react-native-modalize';
import {Title} from 'react-native-paper';
import CartItemEdit from './CartItemEdit';

const Cart = ({navigation}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const modalizeRef = useRef(null);
  const data = useSelector(state => state.cart);
  const auth = useSelector(state => state.auth);
  const [attr, setAttr] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log('cart updated');
  }, [data]);

  const getData = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

    await api
      .get('/user/' + user_data.user_id + '/cart', {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          dispatch(setCart(res.data.data.products));
          console.log(res.data.data.attribute);
          setAttr(res.data.data.attribute);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        console.log('false');

        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const _handleRefresh = () => {
    // dispatch(resetCart(true));
    setLoading(true);
    getData()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    // setLoading(true);
    getData()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [isFocused]);

  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push('Search', {
            screen: 'Product',
            params: {itemid: item.itemmst},
          })
        }>
        <CartItem
          item={item}
          edit={() => {
            setSelectedItem(item);
            modalizeRef.current?.open();
          }}
        />
      </TouchableOpacity>
    );
  };
  const keyExtractor = (item, index) => {
    return String('Cart' + index + item.item_id);
  };
  const keyExtractor2 = (item, index) => {
    return String('Recomendation' + index + item.item_id);
  };
  const _renderRecomendation = recomendations => {
    return (
      <>
        <View style={{alignItems: 'center', paddingVertical: 16}}>
          <Icon name="dots-horizontal" size={48} color={colors.grayLight} />
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            backgroundColor: 'orange',
          }}>
          <View
            style={{
              // backgroundColor: 'orange',
              paddingLeft: 16,
              paddingRight: 50,
              paddingVertical: 16,
              // borderTopRightRadius: 20,
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Beli Juga
            </Text>
            <Text
              style={{
                color: colors.white,
                fontSize: 11,
              }}>
              Produk yang mungkin anda suka
            </Text>
          </View>
        </View>
        <FlatList
          style={{paddingHorizontal: 8, backgroundColor: 'orange'}}
          data={recomendations}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          keyExtractor={keyExtractor2}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.push('Search', {
                  screen: 'Product',
                  params: {itemid: item.itemid},
                })
              }>
              <ProductCard
                item={item}
                style={{
                  width: Dimensions.get('window').width / 4,
                  margin: 4,
                }}
              />
            </TouchableOpacity>
          )}
        />
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : null}
      style={{flex: 1}}>
      <ScreenTitle title="Keranjang Belanja" search />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        contentContainerStyle={{backgroundColor: '#fff', flex: 1}}
        ListEmptyComponent={
          !loading && (
            <Empty
              image="shopping"
              title="Keranjang kosong"
              caption="Tambahkan beberapa produk"
              actionLabel="Cari Produk"
              action={() => navigation.navigate('Search')}
            />
          )
        }
        ListFooterComponent={() =>
          data.length > 0 && attr && _renderRecomendation(attr.recomendation)
        }
        // ListFooterComponentStyle={{backgroundColor: 'orange', marginTop: 80}}
        data={auth.isLogin ? data : []}
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
      />
      {auth.isLogin && data && data.length > 0 && attr && (
        <FooterCart products={data} attribute={attr} />
      )}
      <Modalize
        ref={modalizeRef}
        modalHeight={Dimensions.get('window').height / 1.5}
        modalStyle={{flex: 1, zIndex: 99}}>
        <View style={{padding: 16}}>
          <Title>Edit Keranjang</Title>
          <CartItemEdit
            item={selectedItem}
            closeModal={() => modalizeRef.current?.close()}
          />
        </View>
      </Modalize>
    </KeyboardAvoidingView>
  );
};

export default Cart;
