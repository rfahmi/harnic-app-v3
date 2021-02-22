import React from 'react';
import {ActivityIndicator, Dimensions, View} from 'react-native';
import {Skeleton} from 'react-native-animated-skeleton';

const ProductSkeleton = () => {
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const CONTENT_WIDTH = Dimensions.get('window').width - 32;
  const SKELETON_COLOR = '#ddd';
  return (
    <View>
      <Skeleton
        loaderStyle={{
          width: WINDOW_WIDTH,
          height: WINDOW_WIDTH,
          backgroundColor: SKELETON_COLOR,
        }}
        numberOfItems={1}
      />
      <View style={{padding: 16}}>
        <Skeleton
          loaderStyle={{
            width: CONTENT_WIDTH * 0.3,
            height: 22,
            marginVertical: 4,
            backgroundColor: SKELETON_COLOR,
          }}
          numberOfItems={1}
        />
        <Skeleton
          loaderStyle={{
            width: CONTENT_WIDTH * 0.7,
            height: 22,
            marginVertical: 4,
            backgroundColor: SKELETON_COLOR,
          }}
          numberOfItems={1}
        />
        <View style={{marginVertical: 8}}>
          <Skeleton
            loaderStyle={{
              width: CONTENT_WIDTH,
              height: 14,
              marginVertical: 4,
              backgroundColor: SKELETON_COLOR,
            }}
            direction="column"
            numberOfItems={3}
          />
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
