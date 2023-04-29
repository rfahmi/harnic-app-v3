import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {ActivityIndicator, Dimensions, View} from 'react-native';

const ProductSkeleton = () => {
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const CONTENT_WIDTH = Dimensions.get('window').width - 32;
  const SKELETON_COLOR = '#ddd';
  return (
    <View>
      <ContentLoader
        speed={2}
        width={WINDOW_WIDTH}
        height={WINDOW_WIDTH}
        backgroundColor={SKELETON_COLOR}
        foregroundColor="#f3f3f3">
        <Rect
          x="0"
          y="0"
          rx="0"
          ry="0"
          width={WINDOW_WIDTH}
          height={WINDOW_WIDTH}
        />
      </ContentLoader>
      <View style={{padding: 16, gap: 8}}>
        <ContentLoader
          speed={2}
          width={CONTENT_WIDTH * 0.3}
          height={22}
          backgroundColor={SKELETON_COLOR}
          foregroundColor="#f3f3f3">
          <Rect
            x="0"
            y="0"
            rx="0"
            ry="0"
            width={CONTENT_WIDTH * 0.3}
            height="22"
          />
        </ContentLoader>
        <ContentLoader
          speed={2}
          width={CONTENT_WIDTH * 0.7}
          height={22}
          backgroundColor={SKELETON_COLOR}
          foregroundColor="#f3f3f3">
          <Rect
            x="0"
            y="0"
            rx="0"
            ry="0"
            width={CONTENT_WIDTH * 0.7}
            height="22"
          />
        </ContentLoader>
        <View style={{marginVertical: 8}}>
          <ContentLoader
            speed={2}
            width={CONTENT_WIDTH}
            height={56}
            backgroundColor={SKELETON_COLOR}
            foregroundColor="#f3f3f3">
            <Rect x="0" y="0" rx="0" ry="0" width={CONTENT_WIDTH} height="14" />
            <Rect
              x="0"
              y="20"
              rx="0"
              ry="0"
              width={CONTENT_WIDTH}
              height="14"
            />
            <Rect
              x="0"
              y="40"
              rx="0"
              ry="0"
              width={CONTENT_WIDTH}
              height="14"
            />
          </ContentLoader>
        </View>
        <View
          style={{
            height: 100,
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={SKELETON_COLOR} />
        </View>
      </View>
    </View>
  );
};

export default ProductSkeleton;
