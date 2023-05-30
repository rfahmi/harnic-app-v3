import React, {memo, lazy, Suspense} from 'react';
import {View} from 'react-native';
// import {Skeleton} from 'react-native-animated-skeleton';
import BannerGridSlide from './BannerGridSlide';
import Title from './Title';
import BannerGridV2 from './BannerGridV2';

const YoutubeVideo = lazy(() => import('./YoutubeVideo'));
const YoutubeVideoWebview = lazy(() => import('./YoutubeVideoWebview'));
const ItemSlideBanner = lazy(() => import('./ItemSlideBanner'));
const ItemSlideBasic = lazy(() => import('./ItemSlideBasic'));
const ItemGrid = lazy(() => import('./ItemGrid'));
const BannerGrid = lazy(() => import('./BannerGrid'));
const BannerBasic = lazy(() => import('./BannerBasic'));
const TitleTimer = lazy(() => import('./TitleTimer'));
const Carousel = lazy(() => import('./Carousel'));
const ItemVs = lazy(() => import('./ItemVs'));
const ItemInfinite = lazy(() => import('./ItemInfinite'));

const Panels = ({data, parentScrollViewRef}) => {
  return (
    <View>
      <Suspense
        fallback={
          // <Skeleton
          //   loaderStyle={{
          //     flex: 1,
          //     height: 200,
          //     backgroundColor: '#ddd',
          //   }}
          //   numberOfItems={1}
          // />
          <View />
        }>
        {data.component_type === 'TITLE' ? (
          <Title data={data} />
        ) : data.component_type === 'TITLE_TIMER' ? (
          <TitleTimer data={data} />
        ) : data.component_type === 'ITEM_SLIDE_BASIC' ? (
          <ItemSlideBasic
            data={data}
            parentScrollViewRef={parentScrollViewRef}
          />
        ) : data.component_type === 'ITEM_SLIDE_BANNER' ? (
          <ItemSlideBanner
            data={data}
            parentScrollViewRef={parentScrollViewRef}
          />
        ) : data.component_type === 'ITEM_GRID' ? (
          <ItemGrid data={data} parentScrollViewRef={parentScrollViewRef} />
        ) : data.component_type === 'ITEM_VS' ? (
          <ItemVs data={data} />
        ) : data.component_type === 'ITEM_INFINITE' ? (
          <ItemInfinite data={data} parentScrollViewRef={parentScrollViewRef} />
        ) : data.component_type === 'BANNER_BASIC' ? (
          <BannerBasic data={data} />
        ) : data.component_type === 'YOUTUBE_VIDEO' ? (
          <YoutubeVideo data={data} />
        ) : data.component_type === 'YOUTUBE_VIDEO_WEBVIEW' ? (
          <YoutubeVideoWebview data={data} />
        ) : data.component_type === 'BANNER_GRID' ? (
          <BannerGrid data={data} parentScrollViewRef={parentScrollViewRef} />
        ) : data.component_type === 'BANNER_GRID_V2' ? (
          <BannerGridV2 data={data} parentScrollViewRef={parentScrollViewRef} />
        ) : data.component_type === 'BANNER_GRID_SLIDE' ? (
          <BannerGridSlide
            data={data}
            parentScrollViewRef={parentScrollViewRef}
          />
        ) : data.component_type === 'CAROUSEL' ? (
          <Carousel data={data} parentScrollViewRef={parentScrollViewRef} />
        ) : data.component_type === 'UNKNOWN' ? null : null}
      </Suspense>
    </View>
  );
};

export default memo(Panels);
