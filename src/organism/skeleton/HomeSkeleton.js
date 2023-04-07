import React from 'react';
import {Dimensions, View} from 'react-native';
// import {Skeleton} from 'react-native-animated-skeleton';

const HomeSkeleton = () => {
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const CONTENT_WIDTH = Dimensions.get('window').width - 16;
  const SKELETON_COLOR = '#ddd';
  const GRID_SIZE = 4;
  return (
    <View>
      {/* <Skeleton
        loaderStyle={{
          width: WINDOW_WIDTH,
          height: WINDOW_WIDTH * 0.75,
          backgroundColor: SKELETON_COLOR,
        }}
        numberOfItems={1}
      />
      <View style={{padding: 10, alignItems: 'center'}}>
        <Skeleton
          loaderStyle={{
            width: CONTENT_WIDTH / GRID_SIZE,
            height: CONTENT_WIDTH / GRID_SIZE,
            margin: 4,
            backgroundColor: SKELETON_COLOR,
          }}
          direction="row"
          numberOfItems={GRID_SIZE}
        />
        <Skeleton
          loaderStyle={{
            width: CONTENT_WIDTH / GRID_SIZE,
            height: CONTENT_WIDTH / GRID_SIZE,
            margin: 4,
            backgroundColor: SKELETON_COLOR,
          }}
          direction="row"
          numberOfItems={GRID_SIZE}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <Skeleton
          loaderStyle={{
            width: CONTENT_WIDTH,
            height: CONTENT_WIDTH / GRID_SIZE,
            backgroundColor: SKELETON_COLOR,
          }}
          numberOfItems={1}
        />
        <Skeleton
          loaderStyle={{
            width: CONTENT_WIDTH / 4,
            height: (CONTENT_WIDTH / 4) * 1.5,
            margin: 4,
            backgroundColor: SKELETON_COLOR,
          }}
          direction="row"
          numberOfItems={4}
        />
      </View> */}
    </View>
  );
};

export default HomeSkeleton;
