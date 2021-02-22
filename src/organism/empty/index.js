import React, {memo} from 'react';
import {Dimensions, Image, View} from 'react-native';
import {Button, Caption, Title} from 'react-native-paper';
import * as assets from '../../assets/images';

const Empty = ({image, title, caption, actionLabel, action}) => {
  const WINDOW_WIDTH = Dimensions.get('window').width;
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <Image
        style={{width: WINDOW_WIDTH, height: WINDOW_WIDTH * 0.7}}
        resizeMode="contain"
        source={assets[image]}
      />
      <Title>{title}</Title>
      <Caption>{caption}</Caption>
      {action && (
        <Button
          mode="contained"
          uppercase={false}
          onPress={action}
          style={{marginTop: 16}}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

export default memo(Empty);
