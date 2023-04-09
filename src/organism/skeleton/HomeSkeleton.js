import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {View, Dimensions} from 'react-native';

const HomeSkeleton = () => {
  const windowWidth = Dimensions.get('window').width;
  const contentWidth = windowWidth - 16;
  const skeletonColor = '#ddd';
  const gridSize = 4;

  return (
    <View>
      <ContentLoader
        speed={1}
        backgroundColor={skeletonColor}
        foregroundColor="#ecebeb"
        viewBox={`0 0 ${windowWidth} ${windowWidth * 0.75}`}>
        <Rect x="0" y="0" width={windowWidth} height={windowWidth * 0.75} />
      </ContentLoader>

      <View style={{padding: 10, alignItems: 'center'}}>
        <ContentLoader
          speed={1}
          backgroundColor={skeletonColor}
          foregroundColor="#ecebeb"
          viewBox={`0 0 ${contentWidth} ${contentWidth}`}>
          {[...Array(gridSize * gridSize)].map((_, i) => (
            <Circle
              key={i}
              cx={
                (i % gridSize) * (contentWidth / gridSize) +
                contentWidth / gridSize / 2
              }
              cy={
                Math.floor(i / gridSize) * (contentWidth / gridSize) +
                contentWidth / gridSize / 2
              }
              r={contentWidth / gridSize / 2 - 2}
            />
          ))}
        </ContentLoader>

        <ContentLoader
          speed={1}
          backgroundColor={skeletonColor}
          foregroundColor="#ecebeb"
          viewBox={`0 0 ${contentWidth} ${contentWidth / gridSize}`}>
          <Rect
            x="0"
            y="0"
            width={contentWidth}
            height={contentWidth / gridSize}
          />
        </ContentLoader>

        <ContentLoader
          speed={1}
          backgroundColor={skeletonColor}
          foregroundColor="#ecebeb"
          viewBox={`0 0 ${contentWidth} ${(contentWidth / 4) * 1.5}`}>
          {[...Array(4)].map((_, i) => (
            <Rect
              key={i}
              x={
                (i % 4) * (contentWidth / 4) +
                contentWidth / 4 / 2 -
                contentWidth / 4 / 2 / 2
              }
              y={
                Math.floor(i / 4) * ((contentWidth / 4) * 0.75) +
                (contentWidth / 4 / 2 - contentWidth / 4 / 2 / 2)
              }
              width={contentWidth / 4 / 2}
              height={(contentWidth / 4 / 2) * 1.5}
            />
          ))}
        </ContentLoader>
      </View>
    </View>
  );
};

export default HomeSkeleton;
