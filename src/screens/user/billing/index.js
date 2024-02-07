import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {List} from 'react-native-paper';
import HarnicToast from '@components/HarnicToast';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';
import Empty from '../../../organism/empty';
import {currencyFormat} from '../../../utils/formatter';

const UserBilling = ({navigation, route}) => {
  const {user_id} = route.params;
  const isFocused = useIsFocused();
  const limit = 8;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState([]);

  const getData = async p => {
    console.log('call page: ' + p);
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get(`/user/${user_id}/billing?page=${p}&limit=${limit}`, {
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
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        console.log('false');

        HarnicToast.Show({
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
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    getData(1)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [isFocused]);

  const keyExtractor = (item, index) => {
    return String(item.id);
  };

  const _renderItems = ({item, index}) => {
    return (
      <List.Item
        key={`UserBilling${item.id}`}
        titleNumberOfLines={2}
        titleEllipsizeMode="tail"
        title={item.product_desc}
        description={`Rp ${currencyFormat(Number(item.price))}`}
        descriptionStyle={{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'orange',
          marginBottom: 2,
        }}
        right={() =>
          item.status === 0 ? (
            <List.Icon icon="progress-alert" color="gray" />
          ) : item.status === 1 ? (
            <List.Icon icon="progress-clock" color="orange" />
          ) : item.status === 2 ? (
            <List.Icon icon="progress-check" color="green" />
          ) : item.status === 3 ? (
            <List.Icon icon="check" color="green" />
          ) : item.status === 4 ? (
            <List.Icon icon="check-all" color="green" />
          ) : (
            <List.Icon icon="alert-circle-outline" color="red" />
          )
        }
        onPress={() => navigation.push('BillingView', {trxno: item.trxno})}
      />
    );
  };
  return (
    <>
      <HeaderBack title="Topup & Tagihan" search={false} />
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <Empty
              image="loading"
              title="Belum Ada Transaksi Topup"
              caption="Topup pulsa dan data lewat harnic sekarang"
            />
          )
        }
        contentContainerStyle={{flexGrow: 1}}
        renderItem={_renderItems}
        horizontal={false}
        ListFooterComponent={hasMore ? <ListSkeleton /> : <View />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        style={{backgroundColor: '#fff'}}
        keyExtractor={keyExtractor}
      />
    </>
  );
};

export default UserBilling;
