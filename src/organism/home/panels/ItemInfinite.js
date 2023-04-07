import {useNavigation} from '@react-navigation/native';
import qs from 'qs';
import React, {memo, useEffect, useState, useCallback} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNToasty} from 'react-native-toasty';
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
  const limit_page = 3;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [items, setitems] = useState([]);

  const getItems = async p => {
    // console.log({
    //   keyword: null,
    //   category: category_id[0],
    //   brand: null,
    // });
    // console.log(`/product/find?page=${p}&limit=${limit}`);
    p < limit_page &&
      (await api
        .post(
          `/product/find?page=${p}&limit=${limit}`,
          qs.stringify({
            keyword: null,
            category: category_id[0],
            brand: null,
          }),
        )
        .then(res => {
          // console.log('--------------------------');
          if (res.data.success) {
            if (p > 1) {
              // console.log('>>append');
              setitems([...items, ...res.data.data.products]);
            } else {
              // console.log('>>new');
              setitems(res.data.data.products);
            }
            if (res.data.data.length < limit) {
              // console.log('>>no more');
              setHasMore(false);
            } else {
              // console.log('>>has more');
            }
          } else {
            // console.log('failed');
            RNToasty.Error({
              title: res.data.message,
              position: 'bottom',
            });
          }
          // console.log('--------------------------');
        })
        .catch(err => {
          RNToasty.Error({
            title: err.message,
            position: 'center',
          });
        }));
  };

  useEffect(() => {
    let isSubscribed = true;
    // console.log('+++++++++++++++++++++ kena effect ++++++++++++++++++++++++');
    setPage(1);
    setHasMore(true);
    getItems(1).then(() => {
      if (isSubscribed) {
        setPage(page + 1);
      }
    });
    return () => (isSubscribed = false);
  }, []);

  const onLoadMore = () => {
    getItems(page).then(() => {
      setPage(page + 1);
    });
  };

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
        onEndReached={onLoadMore}
        ListFooterComponent={
          hasMore ? (
            <View
              style={{
                flex: 1,
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="#1100BB" />
            </View>
          ) : (
            <View />
          )
        }
        onEndThreshold={0.5}
        removeClippedSubviews
        initialNumToRender={limit}
        maxToRenderPerBatch={limit}
      />
    </View>
  );
};

export default memo(ItemInfinite);
