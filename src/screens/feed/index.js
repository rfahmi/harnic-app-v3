import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFeedVideo, resetVideos} from '../../configs/redux/slice/feedSlice';
import FeedVideo from './FeedVideo';

const LoadingFooter = () => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#eee',
      width: Dimensions.get('window').width,
      height: 100,
      gap: 8,
    }}>
    <ActivityIndicator size="small" color="#aaa" />
    <Text style={{color: '#aaa', fontWeight: 'bold', fontSize: 11}}>
      Loading Content
    </Text>
  </View>
);

const PAGE_SIZE = 3;

const Feed = () => {
  const [flatlistContainerHeight, setFlatListContainterHeight] = useState(0);
  const flatListContainer = useRef(null);

  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isLast, setIsLast] = useState(false);
  const [pauseAll, setPauseAll] = useState(false);
  const {videos, loading, error} = useSelector(state => state.feed);

  const handleLayout = event => {
    const {height} = event.nativeEvent.layout;
    console.log('updating video height to', height);
    setFlatListContainterHeight(height);
  };

  useEffect(() => {
    if (isFocus) {
      console.log('should reload');
      setPage(1);
    } else {
      console.log('reset');
      setPage(0);
      dispatch(resetVideos());
    }
    setPauseAll(!isFocus);
  }, [dispatch, isFocus]);

  useEffect(() => {
    console.log('now we have', videos.length);
  }, [videos]);

  useEffect(() => {
    console.log('page', page);
    dispatch(fetchFeedVideo({page: page, limit: PAGE_SIZE}));
  }, [dispatch, page]);

  const handleLoadMore = () => {
    if (!loading && !error) {
      // Check if the current page has already been fetched
      const isLastPage = videos.length > 0 && videos.length % PAGE_SIZE !== 0;
      setIsLast(isLastPage);
      // const sisa = videos.length % PAGE_SIZE;

      if (isLastPage) {
        // console.log('loop');
        // setPage(1);
        // console.log('cutting', sisa);
        // dispatch(cutFirstVideo(sisa));
      } else {
        console.log('next page', page + 1, videos.length, PAGE_SIZE);
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  const keyExtractor = item => 'video' + item.itemid;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="rgba(0,0,0,1)"
      />
      <View
        ref={flatListContainer}
        onLayout={handleLayout}
        style={{
          flex: 1,
        }}>
        <FlatList
          style={{
            flex: 1,
            backgroundColor: '#000',
          }}
          data={videos}
          renderItem={({item}) => (
            <FeedVideo
              item={item}
              pauseAll={pauseAll}
              containerHeight={
                flatlistContainerHeight || Dimensions.get('window').height
              }
            />
          )}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          pagingEnabled
          onEndReachedThreshold={2}
          onEndReached={handleLoadMore}
          // ListFooterComponent={loading && LoadingFooter}
        />
      </View>
    </View>
  );
};

export default Feed;
