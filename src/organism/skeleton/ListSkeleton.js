import React from 'react';
import {Dimensions, View} from 'react-native';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {Divider, List} from 'react-native-paper';

const TitleLoader = ({width}) => (
  <ContentLoader
    speed={1}
    width={width}
    height={22}
    backgroundColor="#ddd"
    foregroundColor="#ecebeb">
    <Rect x="0" y="0" rx="4" ry="4" width={width} height="22" />
  </ContentLoader>
);

const DescriptionLoader = ({width}) => (
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
    <>
      <List.Item
        title={() => <TitleLoader width={CONTENT_WIDTH * 0.3} />}
        description={() => <DescriptionLoader width={CONTENT_WIDTH * 0.7} />}
      />
      <Divider />
    </>
  );
};

export default ListSkeleton;
