import React from 'react';
import {Dimensions, View} from 'react-native';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {Divider, List} from 'react-native-paper';

const Skeleton = ({width}) => (
  <ContentLoader
    speed={1}
    width={width}
    height={18}
    backgroundColor="#ddd"
    foregroundColor="#ecebeb">
    <Rect x="0" y="0" rx="4" ry="4" width={width} height="18" />
  </ContentLoader>
);

const ListSkeleton = () => {
  const CONTENT_WIDTH = Dimensions.get('window').width - 32;

  return (
    <View style={{padding: 16, gap: 16}}>
      <View style={{height: 0}} />
      <Skeleton width={CONTENT_WIDTH * 0.3} />
      <Skeleton width={CONTENT_WIDTH * 0.7} />
      <Divider />
    </View>
  );
};

export default ListSkeleton;
