import React, {memo, useState} from 'react';
import {Platform, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {currencyFormat} from '../utils/formatter';
import CornerLabel from './CornerLabel';
import PowerBar from './PowerBar';
import ProductCardBuyButton from './ProductCardBuyButton';
import StarRating from './StarRating';

const ProductCard = ({
  item,
  style,
  buyButton = true,
  progressBar = true,
  showPrice = true,
  showRating = true,
}) => {
  const auth = useSelector((state) => state.auth);
  const [cardWidth, setCardWidth] = useState(0);
  return (
    <View
      onLayout={(e) => {
        setCardWidth(e.nativeEvent.layout.width - 8);
      }}
      style={[
        {
          position: 'relative',
          backgroundColor: '#fff',
          elevation: 2,
          borderRadius: 4,
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
            borderTopRightRadius: 4,
          }}
          source={{
            uri: Platform.OS === 'ios' ? item.picture_ios : item.picture,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={{padding: 4}}>
        <View style={{marginBottom: 8, height: 20}}>
          <Text style={{fontSize: 10}} numberOfLines={2}>
            {item && item.online_name}
          </Text>
        </View>
        {showRating && <StarRating rating={item.rating_avg} />}
        {showPrice && (
          <View style={{height: 42}}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: 'orange',
                marginBottom: 2,
              }}>
              Rp
              {item && item.is_promo
                ? currencyFormat(item.sellprice)
                : currencyFormat(item[auth.priceType] || item.sellprice)}
            </Text>
            {item && item.sellprice2 > 0 && (
              <Text
                style={{
                  fontSize: 10,
                  color: '#555',
                  marginBottom: 4,
                  textDecorationLine: 'line-through',
                }}>
                {'Rp' +
                  currencyFormat(
                    item[auth.priceType] > 0
                      ? item.sellprice2 > item.sellprice
                        ? item.sellprice2
                        : item.sellprice
                      : item.sellprice2,
                  )}
              </Text>
            )}
          </View>
        )}
        {__DEV__ && (
          <>
            <Text style={{fontSize: 8}}>ID: {item.itemid}</Text>
            <Text style={{fontSize: 8}}>Price1: {item.sellprice}</Text>
            <Text style={{fontSize: 8}}>Price2: {item.sellprice2}</Text>
            <Text style={{fontSize: 8}}>Price3: {item.sellprice3}</Text>
            <Text style={{fontSize: 8}}>PriceType: {auth.priceType}</Text>
            <Text style={{fontSize: 8}}>isPromo: {item.is_promo}</Text>
          </>
        )}
        {progressBar && (
          <View style={{marginBottom: 4, height: 12}}>
            {item && Number(item.max_stock) ? (
              <PowerBar
                width={cardWidth}
                current={item.stock || 0}
                max={item.max_stock || 9999}
              />
            ) : (
              <View />
            )}
          </View>
        )}
        {buyButton && (
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
        )}
      </View>
    </View>
  );
};

export default memo(ProductCard);
