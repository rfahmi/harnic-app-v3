import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, FlatList, TouchableOpacity, View} from 'react-native';
import ProductCard from '../../../components/ProductCard';
import ProductCardHorizontal from '../../../components/ProductCardHorizontal';
import ProductCardTall from '../../../components/ProductCardTall';

const ItemSlideBasic = ({data}) => {
  const navigation = useNavigation();

  const keyExtractor = (item, index) => {
    return `ItemSlideBasic${data.component_id}-${item.itemid}-${Math.random(3)}`;
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
              width: Dimensions.get('window').width / data.param1,
              margin: 4,
            }}
          />
        ) : data.card_type === 'TALL' ? (
          <ProductCardTall
            item={item}
            style={{
              width: Dimensions.get('window').width / data.param1,
              margin: 4,
            }}
          />
        ) : (
          <ProductCard
            item={item}
            style={{
              width: Dimensions.get('window').width / data.param1,
              margin: 4,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={{backgroundColor: data.color2, flexDirection: 'row'}}>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 8,
          marginVertical: 8,
        }}
        data={data.items}
        renderItem={_renderItems}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default memo(ItemSlideBasic);
