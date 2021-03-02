import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, FlatList, TouchableOpacity, View} from 'react-native';
import ProductCard from '../../../components/ProductCard';
import ProductCardHorizontal from '../../../components/ProductCardHorizontal';
import ProductCardHorizontalWeight from '../../../components/ProductCardHorizontalWeight';
import ProductCardTall from '../../../components/ProductCardTall';

const ItemGrid = ({data}) => {
  const navigation = useNavigation();
  const keyExtractor = (item, index) => {
    return `ItemGrid${data.component_id}-${item.itemid}-${Math.random(3)}`;
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push('Search', {
            screen: 'Product',
            params: {itemid: item.itemid},
          })
        }>
        {data.card_type === 'HORIZONTAL' ? (
          <ProductCardHorizontal
            item={item}
            style={{
              width: Dimensions.get('window').width / data.param1 - 12,
              margin: 4,
            }}
          />
        ) : data.card_type === 'HORIZONTAL_WEIGHT' ? (
          <ProductCardHorizontalWeight
            item={item}
            style={{
              width: Dimensions.get('window').width / data.param1 - 12,
              margin: 4,
            }}
          />
        ) : data.card_type === 'TALL' ? (
          <ProductCardTall
            item={item}
            style={{
              width: Dimensions.get('window').width / data.param1 - 12,
              margin: 4,
            }}
          />
        ) : (
          <ProductCard
            item={item}
            style={{
              width: Dimensions.get('window').width / data.param1 - 12,
              margin: 4,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        backgroundColor: data.color2,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <FlatList
        data={data.items}
        renderItem={_renderItems}
        numColumns={data.param1}
        horizontal={false}
        keyExtractor={keyExtractor}
        // initialNumToRender={10}
        // maxToRenderPerBatch={10}
        // removeClippedSubviews
      />
    </View>
  );
};

export default memo(ItemGrid);
