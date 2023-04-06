import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, FlatList, TouchableOpacity, View} from 'react-native';
import ProductCard from '../../../components/ProductCard';
import ProductCardHorizontal from '../../../components/ProductCardHorizontal';
import ProductCardTall from '../../../components/ProductCardTall';
import debouncedNavigate from '../../../utils/debouncedNavigate';

const ItemSlideBasic = ({data, parentScrollViewRef}) => {
  const navigation = useNavigation();

  const keyExtractor = (item, index) => {
    return `ItemSlide${data.panel_id}-${data.component_id}-${item.itemid}-${index}`;
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={
          () =>
            debouncedNavigate(navigation.push, 'Search', {
              screen: 'Product',
              params: {itemid: item.itemid},
            })
          // navigation.push('Search', {
          //   screen: 'Product',
          //   params: {itemid: item.itemid},
          // })
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
        parentScrollViewRef={parentScrollViewRef}
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
