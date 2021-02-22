import React, {lazy, Suspense} from 'react';
import {View} from 'react-native';
import {Skeleton} from 'react-native-animated-skeleton';
import Title from './Title';

const ItemSlideBanner = lazy(() => import('./ItemSlideBanner'));
const ItemSlideBasic = lazy(() => import('./ItemSlideBasic'));
const ItemGrid = lazy(() => import('./ItemGrid'));
const BannerGrid = lazy(() => import('./BannerGrid'));
const BannerBasic = lazy(() => import('./BannerBasic'));
const TitleTimer = lazy(() => import('./TitleTimer'));
const Carousel = lazy(() => import('./Carousel'));
const ItemVs = lazy(() => import('./ItemVs'));
const ItemInfinite = lazy(() => import('./ItemInfinite'));

const Panels = ({data}) => {
  return (
    <View>
      <Suspense
        fallback={
          <Skeleton
            loaderStyle={{
              flex: 1,
              height: 200,
              backgroundColor: '#ddd',
            }}
            numberOfItems={1}
          />
        }>
        {data.component_type === 'TITLE' ? (
          <Title data={data} />
        ) : data.component_type === 'TITLE_TIMER' ? (
          <TitleTimer data={data} />
        ) : data.component_type === 'ITEM_SLIDE_BASIC' ? (
          <ItemSlideBasic data={data} />
        ) : data.component_type === 'ITEM_SLIDE_BANNER' ? (
          <ItemSlideBanner data={data} />
        ) : data.component_type === 'ITEM_GRID' ? (
          <ItemGrid data={data} />
        ) : data.component_type === 'ITEM_VS' ? (
          <ItemVs data={data} />
        ) : data.component_type === 'ITEM_INFINITE' ? (
          <ItemInfinite data={data} />
        ) : data.component_type === 'BANNER_BASIC' ? (
          <BannerBasic data={data} />
        ) : data.component_type === 'BANNER_GRID' ? (
          <BannerGrid data={data} />
        ) : data.component_type === 'CAROUSEL' ? (
          <Carousel data={data} />
        ) : data.component_type === 'UNKNOWN' ? null : null}
      </Suspense>
    </View>
  );
};

export default Panels;
