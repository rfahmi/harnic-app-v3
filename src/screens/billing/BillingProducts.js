import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Button, Text, TextInput} from 'react-native-paper';
import {selectContactPhone} from 'react-native-select-contact';
import HarnicToast from '@components/HarnicToast';
import HeaderBackSearch from '../../components/HeaderBackSearch';
import {api} from '../../configs/api';
import {currencyFormat} from '../../utils/formatter';
import {sanitizePhone} from '../../utils/phone';

const BillingProducts = ({navigation, route}) => {
  const [number, setNumber] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {service} = route.params;
  const ITEM_WIDTH = (Dimensions.get('window').width - 42) / 2;

  const getUserData = async () => {
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    if (user_data && user_data.user_phone) {
      setNumber(user_data.user_phone);
      getProduct(user_data.user_phone);
    }
  };
  const getProduct = async customer_id => {
    setLoading(true);
    await api
      .post(
        `/billing/prepaid/products/${service.type_code}`,
        qs.stringify({
          customer_id,
        }),
      )
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
        }
      })
      .catch(err => {
        HarnicToast.Show({
          title: err.message,
          position: 'bottom',
        });
      })
      .finally(() => setLoading(false));
  };

  const _selectContact = async () => {
    if (Platform.OS === 'android') {
      const request = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );

      // denied permission
      if (request === PermissionsAndroid.RESULTS.DENIED)
        throw Error('Permission Denied');
      // user chose 'deny, don't ask again'
      else if (request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
        throw Error('Permission Denied');
    }
    selectContactPhone().then(selection => {
      if (selection) {
        setData([]);
        let {selectedPhone} = selection;
        setNumber(sanitizePhone(selectedPhone.number));
        getProduct(sanitizePhone(selectedPhone.number));
      }
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const _renderItems = ({item}) => {
    return (
      <TouchableOpacity
        key={'service' + item.id}
        onPress={() => {
          navigation.navigate('BillingCheckout', {
            product: item,
            customer_id: number,
          });
        }}>
        <View
          style={{
            position: 'relative',
            borderRadius: 6,
            backgroundColor: '#fff',
            width: ITEM_WIDTH,
            aspectRatio: 2 / 1,
            margin: 2,
          }}>
          <FastImage
            style={{
              // zIndex: 10,
              position: 'absolute',
              top: '25%',
              right: 0,
              width: '50%',
              height: 53,
              opacity: 0.1,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
            source={{
              uri: item.icon_url,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{padding: 6, flex: 1}}>
            <Text
              style={{
                fontSize: 12,
              }}>{`${item.product_description} ${item.product_nominal}`}</Text>
          </View>
          <View style={{padding: 6}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: 'orange',
                marginBottom: 2,
              }}>
              Rp. {currencyFormat(item.product_price)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <HeaderBackSearch />
      <ScrollView
        style={{padding: 16}}
        refreshControl={<RefreshControl refreshing={loading} />}>
        <Text
          variant="titleLarge"
          style={{fontWeight: 'bold', marginBottom: 8}}>
          Nomor HP
        </Text>
        <TextInput
          style={{marginBottom: 8}}
          value={number}
          onChangeText={text => {
            if (data.length > 0) {
              setData([]);
            }
            setNumber(text);
          }}
          label="Nomor HP"
          right={
            <TextInput.Icon icon="contacts" onPress={() => _selectContact()} />
          }
        />
        <Button
          disabled={number.length < 10}
          mode="contained"
          onPress={() => getProduct(number)}>
          Pilih Produk
        </Button>
        <View style={{margin: 16}} />
        {data.length > 0 && (
          <>
            <Text
              variant="titleLarge"
              style={{fontWeight: 'bold', marginBottom: 8}}>
              {service.type_label}
            </Text>
            <FlatList
              key={'prepaidProduct'}
              data={data}
              renderItem={_renderItems}
              numColumns={2}
              horizontal={false}
              // keyExtractor={keyExtractor}
            />
          </>
        )}
      </ScrollView>
    </>
  );
};

export default BillingProducts;
