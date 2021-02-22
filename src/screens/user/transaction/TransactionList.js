import AsyncStorage from '@react-native-community/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {memo, useEffect, useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, List} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import {api} from '../../../configs/api';
import {colors} from '../../../constants/colors';
import Empty from '../../../organism/empty';
import ListSkeleton from '../../../organism/skeleton/ListSkeleton';
import {currencyFormat} from '../../../utils/formatter';

const TransactionList = ({user, status}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const limit = 8;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getData = async (p) => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get(
        `/user/${user}/transaction?page=${p}&limit=${limit}&status=${status}`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then((res) => {
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
  }, [isFocused]);

  const onLoadMore = () => {
    getData(page)
      .then(() => {
        setLoading(false);
        setPage(page + 1);
      })
      .catch(() => setLoading(false));
  };

  const keyExtractor = (item, index) => {
    return String(item.salesid);
  };
  const _renderItems = ({item, index}) => {
    return (
      <>
        <List.Item
          onPress={() =>
            navigation.navigate('TransactionView', {trxno: item.trxno})
          }
          title={`Pesanan ${item.trxno}`}
          titleStyle={{fontSize: 16}}
          titleNumberOfLines={2}
          description={
            <View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 8,
                }}>
                {item.netsales > 0 ? (
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: 'orange',
                      }}>
                      Rp{currencyFormat(item.netsales)}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#e63757',
                      paddingVertical: 2,
                      paddingHorizontal: 4,
                    }}>
                    <Text style={{fontSize: 8, color: '#fff'}}>
                      Order Canceled
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.grayDark,
                  marginTop: 8,
                }}>
                Tanggal {item.orderdate}
              </Text>
            </View>
          }
          right={() => (
            <View style={{justifyContent: 'center'}}>
              <View
                style={{
                  width: 72,
                  aspectRatio: 1 / 1,
                  elevation: 1,
                }}>
                {item.first_item && (
                  <FastImage
                    source={{
                      uri: item.first_item.picture,
                    }}
                    style={{flex: 1, backgroundColor: '#eee', borderRadius: 1}}
                  />
                )}
              </View>
              {item.item_count > 1 && (
                <Text style={{fontSize: 10, color: colors.grayDark}}>
                  dan +{item.item_count - 1} lainnya
                </Text>
              )}
            </View>
          )}
        />
        <Divider />
      </>
    );
  };

  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
      }
      ListEmptyComponent={
        !loading && (
          <Empty
            image="problem_solving"
            title="Tidak ada pesanan disini"
            caption="Coba cari di tab lainnya"
          />
        )
      }
      style={{backgroundColor: '#fff'}}
      contentContainerStyle={{paddingVertical: 12, flexGrow: 1}}
      renderItem={_renderItems}
      horizontal={false}
      keyExtractor={keyExtractor}
      onEndReached={onLoadMore}
      ListFooterComponent={hasMore ? <ListSkeleton /> : <View />}
      onEndThreshold={0.3}
      removeClippedSubviews
      initialNumToRender={limit}
      maxToRenderPerBatch={limit}
    />
  );
};

export default memo(TransactionList);
