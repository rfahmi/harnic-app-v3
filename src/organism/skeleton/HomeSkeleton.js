import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Dimensions, View } from 'react-native';

const HomeSkeleton = () => {
  const windowWidth = Dimensions.get('window').width;
  const contentWidth = windowWidth - 16;
  const skeletonColor = '#ddd';
  const gridSize = 4;

  return (
    <View
      style={{
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <ContentLoader
        speed={1}
        backgroundColor={skeletonColor}
        foregroundColor="#ecebeb"
      >
        <Rect x="0" y="0" width={windowWidth} height={windowWidth * 0.75} />
      </ContentLoader>
    </View>
  );
};

export default HomeSkeleton;
