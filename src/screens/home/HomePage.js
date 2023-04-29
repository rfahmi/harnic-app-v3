import AsyncStorage from '@react-native-async-storage/async-storage';
import {useScrollToTop} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import {FAB} from 'react-native-paper';
import HeaderBackSearch from '../../components/HeaderBackSearch';
import {api} from '../../configs/api';
import Panels from '../../organism/home/panels';
import PageSkeleton from '../../organism/skeleton/PageSkeleton';

const HomePage = ({route}) => {
  const limit = 8;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const {name} = route.params;
  const title = useMemo(() => name.replace('/-/g', ' '), [name]);
  const [panel, setPanel] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const refList = useRef(null);
  const scroll = useMemo(() => new Animated.Value(0), []);
  useScrollToTop(refList);

  const getPanel = useCallback(
    async (n, p) => {
      console.log('Page: ' + p);
      const api_token = await AsyncStorage.getItem('api_token');

      return api
        .get(`/page/${n}?limit=${limit}&page=${p}`, {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        })
        .then(res => {
          if (res.data.success) {
            if (p > 1) {
              console.debug('Append data on page: ' + p);
              setPanel(prevPanel => [...prevPanel, ...res.data.data]);
            } else {
              setPanel(res.data.data);
            }
            if (res.data.data.length < limit) {
              setHasMore(false);
              throw new Error('No more data');
            }
          } else {
            setHasMore(false);
            throw new Error('API error');
          }
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    },
    [limit],
  );

  const _handleRefresh = useCallback(() => {
    setPanel(null);
    setPage(1);
    setHasMore(true);
    setRefreshing(true);
    getPanel(name, 1)
      .then(() => {
        setPage(2);
      })
      .catch(() => console.log())
      .finally(() => setRefreshing(false));
  }, [getPanel, name]);

  const onLoadMore = useCallback(() => {
    console.log('load more', page);
    setLoadingMore(true);
    getPanel(name, page)
      .then(() => {
        setPage(prevPage => prevPage + 1);
      })
      .catch(() => console.log())
      .finally(() => setLoadingMore(false));
  }, [getPanel, name, page]);

  useEffect(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    getPanel(name, 1)
      .then(() => {
        setPage(page + 1);
      })
      .catch(() => console.log())
      .finally(() => setRefreshing(false));
  }, []);

  const _renderPanel = useCallback(({item, index}) => {
    return <Panels data={item} />;
  }, []);

  const keyExtractor = useCallback(
    item => String(`Panel${item.component_id}}`),
    [],
  );

  return (
    <>
      <HeaderBackSearch
        shareData={
          name
            ? {
                url: 'https://harnic.id/url/' + name,
                title: name,
                message: `Temukan produk ${title} termurah, dan pasti gratis ongkir di harnic`,
              }
            : null
        }
      />
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
            data={panel}
            renderItem={_renderPanel}
            keyExtractor={keyExtractor}
            onEndReached={
              hasMore && !loadingMore
                ? onLoadMore
                : console.log(
                    'hasMore:' + hasMore + ', loadingMore: ' + loadingMore,
                  )
            }
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              <View
                style={{
                  flex: 1,
                  padding: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {hasMore || loadingMore ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <Text style={{fontWeight: 'bold'}}>No More Products</Text>
                )}
              </View>
            }
            nestedScrollEnabled
            contentContainerStyle={{paddingBottom: 50}}
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
