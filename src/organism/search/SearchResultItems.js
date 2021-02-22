import {useNavigation} from '@react-navigation/native';
import qs from 'qs';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Caption, Chip, FAB, Title} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import ProductCard from '../../components/ProductCard';
import {api} from '../../configs/api';
import ListSkeleton from '../skeleton/ListSkeleton';

const SearchResultItems = ({keyword, category, tabLabel, brand}) => {
  const navigation = useNavigation();
  const refList = useRef(null);
  const scroll = useRef(new Animated.Value(0)).current;
  const limit = 8;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [filter, setFilter] = useState(true);
  const modalizeRef = useRef(null);
  const openModal = () => {
    modalizeRef.current?.open();
  };

  const getData = async (p) => {
    await api
      .post(
        `/product/find?page=${p}&limit=${limit}`,
        qs.stringify({
          keyword,
          category,
          brand,
        }),
      )
      .then((res) => {
        if (res.data.success) {
          if (p > 1) {
            setData([...data, ...res.data.data.products]);
          } else {
            setData(res.data.data.products);
            setFilterBrand(res.data.data.filter_brands);
          }
          if (res.data.data.length < limit) {
            setHasMore(false);
          }
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch((err) => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
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

  const onLoadMore = () => {
    getData(page)
      .then(() => {
        setLoading(false);
        setPage(page + 1);
      })
      .catch(() => setLoading(false));
  };

  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.push('Product', {itemid: item.itemid})}>
        <ProductCard
          key={item + index}
          item={item}
          style={{width: Dimensions.get('window').width / 2 - 10, margin: 4}}
        />
      </TouchableOpacity>
    );
  };
  const keyExtractor = (item, index) => {
    return String('SearchItem' + index + item.itemid);
  };
  return (
    <>
      <Animated.FlatList
        ref={refList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'flex-start',
        }}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scroll}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        data={data}
        renderItem={_renderItems}
        numColumns={2}
        horizontal={false}
        keyExtractor={keyExtractor}
        onEndReached={onLoadMore}
        ListFooterComponent={hasMore ? <ListSkeleton /> : <View />}
        onEndThreshold={0.5}
        removeClippedSubviews
        initialNumToRender={limit}
        maxToRenderPerBatch={limit}
      />
      <FAB
        visible={filter}
        style={{
          position: 'absolute',
          margin: 16,
          left: 0,
          bottom: 0,
          backgroundColor: '#1100BB',
        }}
        small
        icon="filter"
        label="Filter"
        // onPress={() => {
        //   setFilterBtn(true);
        // }}
        onPress={() => openModal()}
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
      <Modalize
        ref={modalizeRef}
        modalHeight={Dimensions.get('window').height / 2}
        onClose={() => setFilter(true)}
        onOpen={() => setFilter(false)}>
        <ScrollView style={{padding: 16}}>
          <Title>Brand</Title>
          <Caption>Didalam kategori {tabLabel}</Caption>
          <View
            style={{
              padding: 8,
              flex: 1,
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              flexDirection: 'row',
            }}>
            {filterBrand &&
              filterBrand.map((i) => {
                return (
                  <Chip
                    style={{margin: 4}}
                    onPress={() =>
                      navigation.push('SearchResult', {
                        keyword,
                        category,
                        brand: i.id,
                      })
                    }>
                    {i.name}
                  </Chip>
                );
              })}
          </View>
        </ScrollView>
      </Modalize>
    </>
  );
};

export default memo(SearchResultItems);
