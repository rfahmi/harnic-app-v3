import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import ProductCard from '../../../components/ProductCard';
import ProductCardHorizontal from '../../../components/ProductCardHorizontal';
import ProductCardTall from '../../../components/ProductCardTall';

const ItemVs = ({data}) => {
  const navigation = useNavigation();
  const Item = ({item, index}) => {
    return (
      <TouchableOpacity
        key={`ItemVs${data.component_id}-${item.itemid}-${index}`}
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
              width: Dimensions.get('window').width / 2 - 32,
              margin: 4,
            }}
          />
        ) : data.card_type === 'TALL' ? (
          <ProductCardTall
            item={item}
            style={{
              width: Dimensions.get('window').width / 2 - 32,
              margin: 4,
            }}
          />
        ) : (
          <ProductCard
            item={item}
            style={{
              width: Dimensions.get('window').width / 2 - 32,
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
        padding: 8,
      }}>
      {data.items.length > 1 && (
        <>
          <Item item={data.items[0]} />
          <View
            style={{alignItems: 'center', justifyContent: 'center', width: 36}}>
            <Text
              style={{color: data.color1, fontSize: 22, fontWeight: 'bold'}}>
              VS
            </Text>
          </View>
          <Item item={data.items[1]} />
        </>
      )}
    </View>
  );
};

export default memo(ItemVs);
