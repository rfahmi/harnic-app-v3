import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import {Camera, RNCamera} from 'react-native-camera';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import {
  findProductWithBarcode,
  getCartItems,
  updateCartItemQuantity,
  deleteCartItem,
  submitCart,
} from '../../configs/redux/slice/cashierSlice';
import Empty from '../../organism/empty';
import CashierItem from './CashierItem';
import {colors} from '../../constants/colors';
import {Text} from 'react-native';
import {currencyFormat} from '../../utils/formatter';
import {IconButton} from 'react-native-paper';

const Cashier = ({navigation}) => {
  const SCREEN_W = Dimensions.get('screen').width;
  const isFocused = useIsFocused();
  const [processingBarcode, setProcessingBarcode] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const dispatch = useDispatch();
  const {cart, trx, loading, error} = useSelector(state => state.cashier);

  useEffect(() => {
    getPermission();
  }, []);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch, isFocused]);

  const _handleRefresh = () => {
    dispatch(getCartItems());
  };

  const _handleUpdateQty = (itemid, qty) => {
    dispatch(updateCartItemQuantity({itemid, qty}));
  };

  const _handleDelete = itemid => {
    dispatch(deleteCartItem({itemid}));
    dispatch(getCartItems());
  };

  const getPermission = async () => {
    const {status} = await Camera.requestCameraPermissions();
    if (status !== 'granted') {
      Alert.alert({
        title: 'Izin kamera dibutuhkan untuk menggunakan fitur ini.',
        position: 'center',
      });
    }
  };

  const _handleBarcodeRead = async data => {
    if (!processingBarcode) {
      setProcessingBarcode(true);
      console.log(data.data);
      await dispatch(findProductWithBarcode({barcode: data.data}));
      await dispatch(getCartItems());
      setProcessingBarcode(false);
    }
  };

  const _renderItems = ({item, index}) => {
    return (
      <CashierItem
        item={item}
        onUpdateQty={_handleUpdateQty}
        onDelete={_handleDelete}
      />
    );
  };
  const keyExtractor = (item, index) => {
    return String('Cart' + index + item.item_id);
  };

  const activateCamera = () => {
    setCameraActive(true);
  };

  const deactivateCamera = () => {
    setCameraActive(false);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <View
        style={{
          flex: 1,
        }}>
        {error && (
          <View
            style={{
              padding: 8,
              backgroundColor: colors.green,
              alignItems: 'center',
              zIndex: 99,
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>{error}</Text>
          </View>
        )}
        {isFocused && !processingBarcode && cameraActive && (
          <RNCamera
            onBarCodeRead={_handleBarcodeRead}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
            captureAudio={false}>
            <BarcodeMask
              width={SCREEN_W / 2}
              height={80}
              showAnimatedLine={true}
              outerMaskOpacity={0.5}
            />
          </RNCamera>
        )}
      </View>
      <View
        style={{
          flex: 3,
          backgroundColor: '#fff',
        }}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
          }
          style={{flex: 1}}
          contentContainerStyle={{backgroundColor: '#fff', paddingBottom: 64}}
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
        {__DEV__ && false && (
          <View style={{paddingVertical: 4, paddingHorizontal: 16}}>
            <Button
              mode="contained"
              onPress={() => _handleBarcodeRead({data: 1})}>
              Simulate Add Product
            </Button>
          </View>
        )}
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 16,
            alignItems: 'center',
          }}>
          <IconButton
            icon="clock"
            style={{flex: 1}}
            onPress={() => navigation.push('CashierTrxList')}
          />
          <Button
            disabled={cart.length === 0}
            style={{flex: 4}}
            icon="cart"
            mode="contained"
            onPress={() => {
              dispatch(submitCart());
              navigation.push('CashierReceipt');
            }}>
            {`(${cart.length}) ${currencyFormat(
              cart.reduce((acc, item) => acc + parseFloat(item.subtotal), 0),
            )}`}
          </Button>
          <TouchableOpacity
            onPressIn={activateCamera}
            onPressOut={deactivateCamera}
            style={{
              position: 'absolute',
              bottom: 90,
              right: SCREEN_W / 2 - 45,
              width: 60,
              height: 60,
              borderWidth: 16,
              borderColor: '#111',
              borderRadius: 60,
              backgroundColor: 'red',
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Cashier;
