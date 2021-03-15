import React, {memo} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

const BannerItem = ({image, style, aspect = 1}) => {
  return (
    <View style={[{aspectRatio: aspect / 1, backgroundColor: '#fff'}, style]}>
      <FastImage
        style={{
          flex: 1,
        }}
        source={{
          uri: image,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

export default memo(BannerItem);
