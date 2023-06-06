import {useNavigation} from '@react-navigation/native';
import React, {memo, useRef} from 'react';
import {Animated, Dimensions, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import ProductCard from '../../../components/ProductCard';
import ProductCardHorizontal from '../../../components/ProductCardHorizontal';
import ProductCardTall from '../../../components/ProductCardTall';

const ItemSlideBanner = ({data, parentScrollViewRef}) => {
  const navigation = useNavigation();
  const scroll = useRef(new Animated.Value(0)).current;
  const CARD_WIDTH = Dimensions.get('window').width / 3;

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
        <ProductCard
          item={item}
          style={{
            width: CARD_WIDTH,
            margin: 4,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        backgroundColor: data.color2,
        flexDirection: 'row',
        paddingVertical: 8,
      }}>
      <Animated.View
        style={{
          flex: 1,
          paddingLeft: 4,
          paddingVertical: 4,
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
            height: '100%',
            width: CARD_WIDTH,
            flex: 1,
          }}
          source={{
            uri: data.image,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </Animated.View>

      <Animated.FlatList
        parentScrollViewRef={parentScrollViewRef}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scroll}}}],
          {useNativeDriver: true},
        )}
        contentContainerStyle={{
          paddingLeft: CARD_WIDTH + 8,
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
