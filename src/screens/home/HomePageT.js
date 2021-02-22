import {useScrollToTop} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import {FAB} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import HeaderBackSearch from '../../components/HeaderBackSearch';
import {api} from '../../configs/api';
import Panels from '../../organism/home/panels';
import PageSkeleton from '../../organism/skeleton/PageSkeleton';

const HomePage = ({route}) => {
  const refList = useRef(null);
  const scroll = useRef(new Animated.Value(0)).current;
  useScrollToTop(refList);
  const {name} = route.params;
  const [limit] = useState(5);
  const [page, setPage] = useState(1);
  const [clientData, setClientData] = useState([]);
  const [serverData, serverDataLoaded] = useState([]);
  const [pendingProcess, setPendingProcess] = useState(true);
  const [loadmore, setLoadmore] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const requestToServer = async (n, p) => {
    await api
      .get(`/page/${n}?limit=${limit}&page=${p}`)
      .then((res) => {
        if (res.data.success) {
          serverDataLoaded(res.data.data);
        }
      })
      .catch((err) => {
        RNToasty.Error({
          title: err,
          position: 'bottom',
        });
      });
  };

  useEffect(() => {
    console.log('requestToServer');
    requestToServer(name, page);
  }, []);

  useEffect(() => {
    console.log('obtained serverData');
    if (serverData.length > 0) {
      setRefresh(false);
      setClientData([...clientData, ...serverData]);
      setLoadmore(serverData.length === limit ? true : false);
      setPendingProcess(false);
    } else {
      setLoadmore(false);
    }
  }, [serverData]);

  useEffect(() => {
    console.log('load more with page', page);
    if (serverData.length === limit || page === 1) {
      setPendingProcess(true);
      requestToServer(name, page);
    }
  }, [page]);

  const handleLoadMore = () => {
    console.log('loadmore', loadmore);
    console.log('pendingProcess', pendingProcess);
    if (loadmore && !pendingProcess) {
      setPage(page + 1);
    }
  };

  const onRefresh = () => {
    console.log('REFRESH--------------------------------');
    setClientData([]);
    setPage(1);
    setRefresh(true);
    setPendingProcess(false);
  };

  const renderRow = ({item}) => {
    return <Panels data={item} />;
  };

  const keyExtractor = (item, index) => {
    return String(`PageComponent-${item.component_id}`);
  };

  return (
    <>
      <HeaderBackSearch />
      {!clientData ? (
        <PageSkeleton />
      ) : (
        <>
          <Animated.FlatList
            ref={refList}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scroll}}}],
              {useNativeDriver: true},
            )}
            refreshing={refresh}
            data={clientData}
            renderItem={renderRow}
            onEndReached={handleLoadMore}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.3}
            onRefresh={() => onRefresh()}
            ListFooterComponent={loadmore ? <PageSkeleton /> : <View />}
            nestedScrollEnabled
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
