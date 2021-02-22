import React from 'react';
import {View} from 'react-native';
import {Card} from 'react-native-paper';

const FeedItem = ({item}) => {
  return (
    <View>
      <Card style={{margin: 8}} elevation={8}>
        <Card.Title title={item.feed_title} subtitle={item.feed_body} />
        <Card.Cover source={{uri: item.feed_pic}} />
      </Card>
    </View>
  );
};

export default FeedItem;
