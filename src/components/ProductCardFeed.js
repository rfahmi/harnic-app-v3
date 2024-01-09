import React, {Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {currencyFormat} from '../utils/formatter';

const ProductCardFeed = ({item, auth, onPress}) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: 80,
        width: 240,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 20,
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            flex: 1,
            width: 80,
            height: 80,
          }}>
          <FastImage
            style={{
              flex: 1,
              width: 80,
              height: 80,
            }}
            source={{
              uri: item.picture,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: 240 - 80,
            padding: 8,
          }}>
          <View style={{flex: 1, gap: 6}}>
            <Text style={{fontSize: 10, height: 38}} numberOfLines={2}>
              {item.online_name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'orange',
                marginBottom: 2,
              }}>
              Rp.{' '}
              {item && item.is_promo
                ? currencyFormat(item.sellprice)
                : currencyFormat(item[auth.priceType] || item.sellprice)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCardFeed;
