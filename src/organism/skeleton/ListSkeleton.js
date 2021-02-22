import React from 'react';
import {Dimensions, View} from 'react-native';
import {Skeleton} from 'react-native-animated-skeleton';
import {Divider, List} from 'react-native-paper';

const ListSkeleton = () => {
  const CONTENT_WIDTH = Dimensions.get('window').width - 32;
  const SKELETON_COLOR = '#ddd';
  return (
    <>
      <List.Item
        title={
          <Skeleton
            loaderStyle={{
              width: CONTENT_WIDTH * 0.3,
              height: 22,
              marginVertical: 4,
              backgroundColor: SKELETON_COLOR,
            }}
            numberOfItems={1}
          />
        }
        description={
          <Skeleton
            loaderStyle={{
              width: CONTENT_WIDTH * 0.7,
              height: 18,
              marginVertical: 4,
              backgroundColor: SKELETON_COLOR,
            }}
            numberOfItems={1}
          />
        }
      />
      <Divider />
    </>
  );
};

export default ListSkeleton;
