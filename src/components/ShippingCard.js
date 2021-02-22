import React, {memo} from 'react';
import {View, Text, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Caption, Title} from 'react-native-paper';

const ShippingCard = ({name, address}) => {
  return (
    <View
      style={[
        {
          position: 'relative',
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#fff',
          marginHorizontal: 16,
          elevation: 10,
        },
      ]}>
      {/* <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          backgroundColor: 'red',
          height: 100,
        }}>
        <FastImage
          style={{
            position: 'absolute',
            height: 100,
            width: 300,
            top: 0,
            bottom: 0,
            right: 0,
          }}
          source={{
            uri:
              'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.337798,37.810550,9.67,0.00,0.00/300x100@2x?access_token=pk.eyJ1IjoiaGFybmljaWQiLCJhIjoiY2tqYjU0MjZ2MGhkazJ3bDNnaXZ1bGV0ZCJ9.g6UNpn-7sK3xMMzblwax4A',
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View> */}

      <Title>{name}</Title>
      <Caption>{address}</Caption>
    </View>
  );
};

export default memo(ShippingCard);
