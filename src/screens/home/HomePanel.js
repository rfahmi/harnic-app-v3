import AsyncStorage from '@react-native-community/async-storage';
import {useScrollToTop} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, RefreshControl, View} from 'react-native';
import {FAB} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import HeaderBackSearch from '../../components/HeaderBackSearch';
import {api} from '../../configs/api';
import Panels from '../../organism/home/panels';
import ListSkeleton from '../../organism/skeleton/ListSkeleton';
import PageSkeleton from '../../organism/skeleton/PageSkeleton';

const HomePage = ({navigation, route}) => {
  // const panels2 = require('../../dummy/panels.json');
  const limit = 8;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {name} = route.params;
  const [panel, setPanel] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const refList = useRef(null);
  const scroll = useRef(new Animated.Value(0)).current;
  useScrollToTop(refList);

  const getPanel = async (n, p) => {
    const api_token = await AsyncStorage.getItem('api_token');
    console.log('aa');
    await api
      .get(`/panel/${n}?limit=${limit}&page=${p}`, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then((res) => {
        console.log('panels ', res.data.data);
        if (res.data.success) {
          if (p > 1) {
            setPanel([...panel, ...res.data.data]);
          } else {
            setPanel(res.data.data);
          }
          if (res.data.data.length < limit) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      })
      .catch((err) => {
        RNToasty.Error({
          title: err,
          position: 'bottom',
        });
      });
  };
  const _handleRefresh = () => {
    console.log('ccc');
    setPanel(null);
    setPage(1);
    setHasMore(true);
    setRefreshing(true);
    getPanel(name, 1)
      .then(() => {
        setRefreshing(false);
        setPage(page + 1);
      })
      .catch(() => setRefreshing(false));
  };

  const onLoadMore = () => {
    getPanel(name, page)
      .then(() => {
        setRefreshing(false);
        setPage(page + 1);
      })
      .catch(() => setRefreshing(false));
  };

  useEffect(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    getPanel(name, 1)
      .then(() => {
        setRefreshing(false);
        setPage(page + 1);
      })
      .catch(() => setRefreshing(false));
  }, []);

  const _renderPanel = ({item, index}) => {
    return <Panels data={item} />;
  };

  const keyExtractor = (item, index) => {
    return String(`Panel${item.component_id}`);
  };

  return (
    <>
      <HeaderBackSearch />
      {!panel ? (
        <PageSkeleton />
      ) : (
        <>
          <Animated.FlatList
            ref={refList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={_handleRefresh}
              />
            }
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scroll}}}],
              {useNativeDriver: true},
            )}
            scrollEventThrottle={16}
            data={panel}
            renderItem={_renderPanel}
            keyExtractor={keyExtractor}
            onEndReached={onLoadMore}
            ListFooterComponent={hasMore ? <ListSkeleton /> : <View />}
            nestedScrollEnabled
            onEndThreshold={0.5}
            // removeClippedSubviews
            // initialNumToRender={limit}
            // maxToRenderPerBatch={limit}
          />
          <FAB
            style={{
              position: 'absolute',
              margin: 16,
              right: 0,
              bottom: 0,
              backgroundColor: '#1100BB',
              opacity: scroll.interpolate({
                inputRange: [0, 300],
                outputRange: [0, 1],
              }),
            }}
            small
            icon="chevron-up"
            onPress={() =>
              refList.current.scrollToOffset({animated: true, offset: 0})
            }
          />
        </>
      )}
    </>
  );
};

export default HomePage;
