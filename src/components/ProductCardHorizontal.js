import React, {memo} from 'react';
import {Platform, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import CornerLabel from '../components/CornerLabel';
import {currencyFormat} from '../utils/formatter';
import ProductCardBuyButton from './ProductCardBuyButton';

const ProductCardHorizontal = ({item, style}) => {
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
      {!item.discount && (
        <CornerLabel
          cornerRadius={40}
          alignment={'right'}
          style={{backgroundColor: 'orange', height: 18}}
          textStyle={{color: '#fff', fontSize: 10}}>
          -20%
        </CornerLabel>
      )}
      <View style={{aspectRatio: 1 / 1}}>
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
          Rp{currencyFormat(item.sellprice || 0)}
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
    </View>
  );
};

export default memo(ProductCardHorizontal);
