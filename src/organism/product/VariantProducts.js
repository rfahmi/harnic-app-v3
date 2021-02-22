import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, FlatList, TouchableOpacity, View} from 'react-native';
import ProductCard from '../../components/ProductCard';

const VariantProducts = ({items}) => {
  const navigation = useNavigation();

  const keyExtractor = (item, index) => {
    return `VariantProducts${item.itemid}-${index}`;
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.push('Product', {itemid: item.itemid})}>
        <ProductCard
          item={item}
          style={{
            width: Dimensions.get('window').width / 4,
            margin: 4,
          }}
          showPrice={false}
          progressBar={false}
          buyButton={false}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flexDirection: 'row'}}>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 8,
          marginVertical: 8,
        }}
        data={items}
        renderItem={_renderItems}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        removeClippedSubviews={true}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default memo(VariantProducts);
