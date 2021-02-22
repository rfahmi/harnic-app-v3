import React from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-paper';
import StarRating from '../../components/StarRating';

const ProductReviewItem = ({item}) => {
  return (
    <View>
      <Card
        style={{
          marginHorizontal: 8,
          marginVertical: 4,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
        elevation={0}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontWeight: 'bold'}}>{item.user_name}</Text>
          <Text style={{marginHorizontal: 8}}>{'\u2022'}</Text>
          <StarRating rating={item.rating} />
        </View>
        <Text style={{fontSize: 12}}>{item.comment_body}</Text>
      </Card>
    </View>
  );
};

export default ProductReviewItem;
