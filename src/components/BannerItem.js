import React, {memo} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

const BannerItem = ({image, style}) => {
  return (
    <View style={[{aspectRatio: 1 / 1, backgroundColor: '#fff'}, style]}>
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
