import {useNavigation} from '@react-navigation/native';
import React, {memo, useRef} from 'react';
import {Animated, Dimensions, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import ProductCard from '../../../components/ProductCard';
import ProductCardHorizontal from '../../../components/ProductCardHorizontal';
import ProductCardTall from '../../../components/ProductCardTall';

const ItemSlideBanner = ({data}) => {
  const navigation = useNavigation();
  const scroll = useRef(new Animated.Value(0)).current;

  const keyExtractor = (item, index) => {
    return String(`ItemSlideBanner${item.itemid}-${index}`);
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
      <Animated.View
        style={{
          flex: 1,
          position: 'absolute',
          height: '100%',
          aspectRatio: 1 / 2,
          transform: [
            {
              translateX: scroll.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -10],
              }),
            },
          ],
          opacity: scroll.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0.5],
          }),
        }}>
        <FastImage
          style={{
            flex: 1,
          }}
          source={{
            uri: data.image,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </Animated.View>

      <Animated.FlatList
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scroll}}}],
          {useNativeDriver: true},
        )}
        contentContainerStyle={{
          paddingLeft: 100,
          marginVertical: 8,
        }}
        data={data.items}
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

export default memo(ItemSlideBanner);
