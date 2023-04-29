import {useNavigation} from '@react-navigation/native';
import qs from 'qs';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductCard from '../../../components/ProductCard';
import ProductCardHorizontal from '../../../components/ProductCardHorizontal';
import ProductCardTall from '../../../components/ProductCardTall';
import {api} from '../../../configs/api';

const ItemInfinite = ({data, parentScrollViewRef}) => {
  const navigation = useNavigation();
  const category_id = String(data.api)
    .replace('product/infinite/', '')
    .split('/');
  const limit = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [items, setItems] = useState([]);

  const getItems = useCallback(
    async p => {
      console.log('Page: ' + p);
      return api
        .get(
          `/product/find?page=${p}&limit=${limit}`,
          qs.stringify({
            keyword: null,
            category: category_id[0],
            brand: null,
          }),
        )
        .then(res => {
          if (res.data.success) {
            if (p > 1) {
              console.debug('Append data on page: ' + p);
              setItems(prevItems => [...prevItems, ...res.data.data.products]);
            } else {
              setItems(res.data.data.products);
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
    [category_id],
  );

  const onLoadMore = useCallback(() => {
    console.log('load more', page);
    setLoadingMore(true);
    getItems(page)
      .then(() => {
        setPage(prevPage => prevPage + 1);
      })
      .catch(() => console.log())
      .finally(() => setLoadingMore(false));
  }, [getItems, page]);

  useEffect(() => {
    let isSubscribed = true;
    setPage(1);
    setHasMore(true);
    getItems(1)
      .then(() => {
        if (isSubscribed) {
          setPage(page + 1);
        }
      })
      .catch(e => console.error(e));
    return () => (isSubscribed = false);
  }, []);

  const keyExtractor = (item, index) => {
    return `ItemInfinite${data.panel_id}-${data.component_id}-${item.itemid}-${index}`;
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push('Search', {
            screen: 'Product',
            params: {itemid: item.itemid},
          })
        }>
        {data.card_type === 'HORIZONTAL' ? (
          <ProductCardHorizontal
            item={item}
            style={{
              width: Dimensions.get('window').width / data.param1 - 12,
              margin: 4,
            }}
          />
        ) : data.card_type === 'TALL' ? (
          <ProductCardTall
            item={item}
            style={{
              width: Dimensions.get('window').width / data.param1 - 12,
              margin: 4,
            }}
          />
        ) : (
          <ProductCard
            item={item}
            style={{
              width: Dimensions.get('window').width / data.param1 - 12,
              margin: 4,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        backgroundColor: data.color2,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <FlatList
        parentScrollViewRef={parentScrollViewRef}
        data={items}
        renderItem={_renderItems}
        numColumns={data.param1}
        horizontal={false}
        keyExtractor={keyExtractor}
        onEndReached={
          hasMore && !loadingMore
            ? onLoadMore
            : console.log(
                'hasMore:' + hasMore + ', loadingMore: ' + loadingMore,
              )
        }
        ListFooterComponent={
          <View
            style={{
              flex: 1,
              padding: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {loadingMore ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Text style={{fontWeight: 'bold'}}>No More Products</Text>
            )}
          </View>
        }
        onEndReachedThreshold={0.5}
        removeClippedSubviews
        initialNumToRender={limit}
        maxToRenderPerBatch={limit}
      />
    </View>
  );
};

export default memo(ItemInfinite);
