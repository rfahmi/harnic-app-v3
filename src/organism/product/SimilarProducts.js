import {useNavigation} from '@react-navigation/native';
import QueryString from 'qs';
import React, {memo, useEffect, useState} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from 'react-native';
import ProductCard from '../../components/ProductCard';
import {api} from '../../configs/api';
import {colors} from '../../constants/colors';
import ListSkeleton from '../skeleton/ListSkeleton';

const SimilarProducts = ({category}) => {
  const navigation = useNavigation();
  const limit = 10;
  const [recPage, setRecPage] = useState(1);
  const [recItems, setRecItems] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const getRecomendation = async () => {
    await api
      .post(
        `/product/find?page=${recPage}&limit=${limit}`,
        QueryString.stringify({
          category,
        }),
      )
      .then((res) => {
        if (res.data.success) {
          if (recPage > 1) {
            setRecItems([...recItems, ...res.data.data.products]);
          } else {
            setRecItems(res.data.data.products);
          }
          if (res.data.data.length < limit) {
            setHasMore(false);
          }
          setRecPage(recPage + 1);
        } else {
        }
      });
  };

  useEffect(() => {
    setRecPage(1);
    getRecomendation();
  }, []);
  const onLoadMore = () => {
    getRecomendation();
  };

  const keyExtractor = (item, index) => {
    return String(index + item.itemid);
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        key={`SimilarProducts${item.itemid}-${index}`}
        onPress={() => navigation.push('Product', {itemid: item.itemid})}>
        <ProductCard
          item={item}
          style={{
            width: Dimensions.get('window').width / 2 - 10,
            margin: 4,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View
        style={{
          paddingHorizontal: 8,
          marginVertical: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.primary}}>
          Produk Serupa
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'flex-start',
        }}
        data={recItems}
        renderItem={_renderItems}
        numColumns={2}
        horizontal={false}
        keyExtractor={keyExtractor}
        // onEndReached={onLoadMore}
        ListFooterComponent={hasMore ? <ListSkeleton /> : <View />}
        onEndReachedThreshold={0.3}
        removeClippedSubviews
        initialNumToRender={limit}
        maxToRenderPerBatch={limit}
      />
    </>
  );
};

export default memo(SimilarProducts);
