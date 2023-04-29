import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useRef, useState, useEffect} from 'react';
import {
  Animated,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNToasty} from 'react-native-toasty';
import ScreenTitleParallax from '../../components/ScreenTitleParallax';
import {api} from '../../configs/api';
import Empty from '../../organism/empty';
import ListSkeleton from '../../organism/skeleton/ListSkeleton';
import FeedItem from './FeedItem';

const Feed = () => {
  const [data, setData] = useState(null);
  const limit = 16;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const scroll = useRef(new Animated.Value(0)).current;

  const getData = async p => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get('/feed', {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          if (p > 1) {
            setData([...data, ...res.data.data]);
          } else {
            setData(res.data.data);
          }
          if (res.data.data.length < limit) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        setHasMore(false);
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const _handleClaim = async vc_id => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    await api
      .get('/user/' + user_data.user_id + '/voucher/' + vc_id + '/claim', {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          RNToasty.Success({
            title: res.data.message,
            position: 'bottom',
          });
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const onLoadMore = () => {
    getData(page)
      .then(() => {
        setLoading(false);
        setPage(page + 1);
      })
      .catch(() => setLoading(false));
  };
  const _handleRefresh = () => {
    setData(null);
    setLoading(true);
    getData(1)
      .then(() => {
        setLoading(false);
        setPage(page + 1);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    getData(1)
      .then(() => {
        setLoading(false);
        setPage(page + 1);
      })
      .catch(() => setLoading(false));
  }, []);

  const styles = StyleSheet.create({
    titleBar: {
      transform: [
        {
          translateY: scroll.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -10],
          }),
        },
      ],
    },
  });

  const _renderItems = ({item}) => {
    return (
      <TouchableOpacity onPress={() => _handleClaim(item.vc_id)}>
        <FeedItem item={item} />
      </TouchableOpacity>
    );
  };
  const keyExtractor = (item, index) => {
    return String('Feed' + index + item.feed_id);
  };

  return (
    <>
      <ScreenTitleParallax
        title="Promosi Terbaru"
        description="Temukan promo terbaru disini"
        style={styles.titleBar}
        opacity={scroll.interpolate({
          inputRange: [0, 300],
          outputRange: [1, 0],
        })}
      />
      <Animated.FlatList
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scroll}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 100 + StatusBar.currentHeight,
          flexGrow: 1,
        }}
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <Empty
              image="marketing"
              title="Belum ada promosi"
              caption="Nantikan promo-promo menarik disini"
            />
          )
        }
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
        onEndReached={onLoadMore}
        ListFooterComponent={hasMore ? <ListSkeleton /> : <View />}
        onEndReachedThreshold={0.3}
        removeClippedSubviews
        initialNumToRender={limit}
        maxToRenderPerBatch={limit}
      />
    </>
  );
};

export default Feed;
