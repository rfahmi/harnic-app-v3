import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button, Card, Paragraph, Title} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import HeaderBackSearch from '../../components/HeaderBackSearch';
import {api} from '../../configs/api';
import {colors} from '../../constants/colors';
import {currencyFormat} from '../../utils/formatter';

const BillingCheckout = ({navigation, route}) => {
  const {product, customer_id} = route.params;
  const [loading, setLoading] = useState(false);
  const checkout = async () => {
    setLoading(true);
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .post(
        `user/${user_data.user_id}/billing`,
        qs.stringify({
          type: product.product_type,
          customer_id: customer_id,
          product_code: product.product_code,
        }),
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
        if (res.data.success) {
          navigation.replace('UserBilling', {
            screen: 'BillingView',
            params: {trxno: res.data.data.trxno},
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        RNToasty.Error({
          title: err.message,
          position: 'bottom',
        });
      });
  };

  return (
    <>
      <ScrollView>
        <HeaderBackSearch />
        <Card>
          <Card.Content>
            <Title>{`${product.product_description} ${product.product_nominal}`}</Title>
            <Paragraph>{product.product_details}</Paragraph>
            <Paragraph>{customer_id}</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
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
              {currencyFormat(product.product_price)}
            </Text>
          </View>
          <View
            style={{
              flex: 2,
            }}>
            <Button
              disabled={loading}
              loading={loading}
              onPress={() => checkout()}
              style={{margin: 4}}
              labelStyle={{fontSize: 12, fontWeight: 'bold'}}
              color={colors.green}
              mode="contained">
              Checkout
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};

export default BillingCheckout;
