import React from 'react';
import {Dimensions, View} from 'react-native';
import ContentLoader, {Rect} from 'react-content-loader/native';

const PageSkeleton = () => {
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const CONTENT_WIDTH = Dimensions.get('window').width - 32;
  const SKELETON_COLOR = '#ddd';

  return (
    <View>
      <ContentLoader
        speed={1}
        backgroundColor={SKELETON_COLOR}
        foregroundColor="#ecebeb"
        viewBox={`0 0 ${WINDOW_WIDTH} ${WINDOW_HEIGHT / 4}`}>
        <Rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT / 4}
        />
      </ContentLoader>
      <View style={{padding: 10, alignItems: 'center'}}>
        <ContentLoader
          speed={1}
          backgroundColor={SKELETON_COLOR}
          foregroundColor="#ecebeb"
          viewBox={`0 0 ${CONTENT_WIDTH} ${CONTENT_WIDTH / 3}`}>
          <Rect
            x="0"
            y="0"
            rx="0"
            ry="0"
            width={CONTENT_WIDTH / 3}
            height={CONTENT_WIDTH / 3}
          />
          <Rect
            x={CONTENT_WIDTH / 3 + 8}
            y="0"
            rx="0"
            ry="0"
            width={CONTENT_WIDTH / 3}
            height={CONTENT_WIDTH / 3}
          />
          <Rect
            x={(CONTENT_WIDTH / 3 + 8) * 2}
            y="0"
            rx="0"
            ry="0"
            width={CONTENT_WIDTH / 3}
            height={CONTENT_WIDTH / 3}
          />
        </ContentLoader>
        <ContentLoader
          speed={1}
          backgroundColor={SKELETON_COLOR}
          foregroundColor="#ecebeb"
          viewBox={`0 0 ${CONTENT_WIDTH} ${CONTENT_WIDTH / 3}`}>
          <Rect
            x="0"
            y="0"
            rx="0"
            ry="0"
            width={CONTENT_WIDTH / 3}
            height={CONTENT_WIDTH / 3}
          />
          <Rect
            x={CONTENT_WIDTH / 3 + 8}
            y="0"
            rx="0"
            ry="0"
            width={CONTENT_WIDTH / 3}
            height={CONTENT_WIDTH / 3}
          />
          <Rect
            x={(CONTENT_WIDTH / 3 + 8) * 2}
            y="0"
            rx="0"
            ry="0"
            width={CONTENT_WIDTH / 3}
            height={CONTENT_WIDTH / 3}
          />
        </ContentLoader>
      </View>
    </View>
  );
};

export default PageSkeleton;
