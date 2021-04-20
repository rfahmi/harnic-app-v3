import React, {memo} from 'react';
import {Platform, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import CornerLabel from '../components/CornerLabel';
import {currencyFormat} from '../utils/formatter';
import ProductCardBuyButton from './ProductCardBuyButton';

const ProductCardHorizontalWeight = ({item, style}) => {
  const auth = useSelector((state) => state.auth);
  return (
    <View
      style={[
        {
          position: 'relative',
          backgroundColor: '#fff',
          elevation: 2,
          borderRadius: 4,
          flexDirection: 'row',
          overflow: 'hidden',
        },
        style,
      ]}>
      {item.discount && (
        <CornerLabel
          cornerRadius={40}
          alignment={'right'}
          style={{backgroundColor: 'orange', height: 18}}
          textStyle={{color: '#fff', fontSize: 10}}>
          {item.discount}
        </CornerLabel>
      )}
      <View style={{aspectRatio: 1 / 1}}>
        {item.stock < 1 && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              HABIS
            </Text>
          </View>
        )}
        <FastImage
          style={{
            flex: 1,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }}
          source={{
            uri: Platform.OS === 'ios' ? item.picture_ios : item.picture,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={{flex: 1, padding: 8}}>
        <View style={{height: 20}}>
          <Text style={{fontSize: 12}} numberOfLines={2}>
            {item.online_name}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 11,
            fontWeight: 'bold',
            color: 'orange',
            marginTop: 8,
          }}>
          Rp
          {item && item.is_promo
            ? item.sellprice
            : currencyFormat(item[auth.priceType] || item.sellprice)}
        </Text>
        <ProductCardBuyButton
          id={item.itemid}
          stock={item.stock || 0}
          maxOrder={item.max_order || 0}
          containerStyle={{marginTop: 8, flex: 1, flexDirection: 'row'}}
          buttonStyle={{
            borderRadius: 6,
            flex: 1,
          }}
        />
      </View>
      {item.weight && (
        <View
          style={{
            backgroundColor: '#1100BB',
            aspectRatio: 1 / 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 32, fontWeight: 'bold', color: '#fff'}}>
            {item.weight}
          </Text>
          <Text style={{fontSize: 16, color: '#fff'}}>KG</Text>
        </View>
      )}
    </View>
  );
};

export default memo(ProductCardHorizontalWeight);
