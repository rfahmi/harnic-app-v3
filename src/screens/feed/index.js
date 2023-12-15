import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getStatusBarHeight} from 'react-native-safearea-height';
import Video from 'react-native-video';
import {useDispatch, useSelector} from 'react-redux';
import {
  cutFirstVideo,
  fetchFeedVideo,
  resetVideos,
} from '../../configs/redux/slice/feedSlice';
import {currencyFormat} from '../../utils/formatter';
import {ActivityIndicator} from 'react-native-paper';

const STATUSBAR_HEIGHT = getStatusBarHeight();

const FeedItem = ({item, idPlayed, pauseAll}) => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth);
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(idPlayed !== item.uniqueId);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    videoRef.current?.seek(0);
    setIsPaused(idPlayed !== item.uniqueId);
  }, [idPlayed, item, pauseAll]);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleBuffer = ({isBuffering}) => {
    setIsLoading(isBuffering);
  };

  const handleError = error => {
    console.error('Video Error:', error);
    setIsLoading(false);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleTogglePause();
      }}
      activeOpacity={1}
      style={styles.container}>
      <Video
        ref={videoRef}
        source={{uri: item.feed_video}}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={isPaused || pauseAll}
        onBuffer={handleBuffer}
        onError={handleError}
      />

      {isLoading && (
        <ActivityIndicator
          style={{position: 'absolute', top: '45%', left: '45%'}}
          size="large"
          color="#fff"
        />
      )}

      <View
        style={{
          backgroundColor: '#fff',
          height: 80,
          width: 300,
          borderRadius: 8,
          overflow: 'hidden',
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 20,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.push('Search', {
                screen: 'Product',
                params: {itemid: item.itemid},
              })
            }
            style={{
              flex: 1,
              width: 80,
              height: 80,
            }}>
            <FastImage
              style={{
                flex: 1,
              }}
              source={{
                uri: item.picture,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.push('Search', {
                screen: 'Product',
                params: {itemid: item.itemid},
              })
            }
            style={{
              flex: 1,
              width: 300 - 80,
              padding: 8,
            }}>
            <View style={{flex: 1, gap: 6}}>
              <Text style={{fontSize: 10, height: 38}} numberOfLines={2}>
                {item.online_name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'orange',
                  marginBottom: 2,
                }}>
                Rp.{' '}
                {item && item.is_promo
                  ? currencyFormat(item.sellprice)
                  : currencyFormat(item[auth.priceType] || item.sellprice)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - (STATUSBAR_HEIGHT - 14),
  },
  video: {
    flex: 1,
  },
});

const PAGE_SIZE = 4;

const Feed = () => {
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pauseAll, setPauseAll] = useState(false);
  const {videos, loading, error} = useSelector(state => state.feed);

  const [idPlayed, setIdPlayed] = useState(0);
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems.find(a => a.isViewable);

      if (visibleItem.item) {
        setIdPlayed(visibleItem.item.uniqueId);
      } else {
        setIdPlayed(0);
      }
    }
  });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  });

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
  }, [isFocus]);

  useEffect(() => {
    console.log('now we have', videos.length);
  }, [videos]);

  // useEffect(() => {
  //   // console.log('videos length', videos.length);
  //   if (idPlayed !== 0) {
  //     handleLoadMore();
  //   }
  // }, [idPlayed]);

  useEffect(() => {
    console.log('page', page);
    dispatch(fetchFeedVideo({page: page, limit: PAGE_SIZE}));
  }, [dispatch, page]);

  const handleLoadMore = () => {
    if (!loading && !error) {
      console.log('next page', page + 1, videos.length, PAGE_SIZE);
      setPage(prevPage => prevPage + 1);
    }

    // Check if the current page has already been fetched
    const isLastPage = videos.length > 0 && videos.length % PAGE_SIZE !== 0;

    const sisa = videos.length % PAGE_SIZE;

    dispatch(cutFirstVideo(sisa));

    if (isLastPage) {
      console.log('loop');
      setPage(1); // Reset to the first page
    }
  };

  const keyExtractor = item => 'video' + item.uniqueId;

  return (
    <>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="rgba(0,0,0,0.1)"
      />
      <FlatList
        style={{backgroundColor: '#000'}}
        data={videos}
        renderItem={({item}) => (
          <FeedItem idPlayed={idPlayed} item={item} pauseAll={pauseAll} />
        )}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        pagingEnabled
        onEndReachedThreshold={2}
        onEndReached={handleLoadMore}
      />
    </>
  );
};

export default Feed;
