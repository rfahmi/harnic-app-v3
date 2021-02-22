import React from 'react';
import {FlatList, Text, View} from 'react-native';
import StarRating from '../../components/StarRating';
import ProductReviewItem from './ProductReviewItem';

const Feed = ({route}) => {
  console.log(route.params);
  const {reviews, rating_avg, rating_avg_formatted} = route.params;
  const _renderHeader = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          marginVertical: 16,
          flex: 1,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 32}}>
          {rating_avg_formatted}
        </Text>
        <StarRating rating={rating_avg} />
      </View>
    );
  };
  const _renderItems = ({item}) => {
    return <ProductReviewItem item={item} />;
  };
  const keyExtractor = (item, index) => {
    return String('ShopList' + index + item.item_id);
  };

  return (
    <>
      <FlatList
        ListHeaderComponent={_renderHeader}
        scrollEventThrottle={16}
        data={reviews}
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
      />
    </>
  );
};

export default Feed;
