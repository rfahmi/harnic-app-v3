import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {Button, Divider, FAB, List, Paragraph, Title} from 'react-native-paper';
import HarnicToast from '@components/HarnicToast';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';
import {colors} from '../../../constants/colors';
import Empty from '../../../organism/empty';
import ListSkeleton from '../../../organism/skeleton/ListSkeleton';

const UserNotification = ({navigation, route}) => {
  const {user_id} = route.params;
  const limit = 16;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fabShow, setFabShow] = useState(true);
  const [data, setData] = useState(null);
  const [dataSelected, setDataSelected] = useState(null);
  const modalizeRef = useRef(null);
  const WINDOW_HEIGHT = Dimensions.get('window').height;

  const getData = async p => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get(`/user/${user_id}/news?page=${p}&limit=${limit}`, {
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
        setHasMore(false);
        console.log(err.message);
        // HarnicToast.Show({
        //   title: err.message,
        //   position: 'center',
        // });
      });
  };

  const deleteData = async id => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .delete('/user/' + user_id + '/news/' + id, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          _handleRefresh();
        } else {
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        HarnicToast.Show({
          title: err.message,
          position: 'center',
        });
      });
  };
  const readData = async id => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .put(
        `/user/${user_id}/news/${id}/read`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then(res => {
        if (res.data.success) {
          _handleRefresh();
        } else {
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        console.log('err', err);
        HarnicToast.Show({
          title: err.message,
          position: 'center',
        });
      });
  };
  const readAllData = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .put(
        `/user/${user_id}/news/readall`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then(res => {
        console.log('res', res);
        if (res.data.success) {
          _handleRefresh();
        } else {
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        console.log('err', err);
        HarnicToast.Show({
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
  const _handleDelete = news_id => {
    setLoading(true);
    deleteData(news_id)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };
  const onLoadMore = () => {
    getData(page)
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

  const keyExtractor = (item, index) => {
    return `UserNotification${item.news_id}-${index}`;
  };
  const _renderItems = ({item, index}) => {
    return (
      <>
        <List.Item
          title={item.title}
          titleStyle={{
            fontWeight: item.read ? 'normal' : 'bold',
            color: item.read ? '#aaa' : '#000',
          }}
          description={item.body}
          descriptionStyle={{
            fontWeight: item.read ? 'normal' : 'bold',
            color: item.read ? '#aaa' : '#000',
          }}
          left={() => (
            <List.Icon icon={item.read ? 'bell-outline' : 'bell-alert'} />
          )}
          onPress={async () => {
            console.log(item);
            setDataSelected(item);
            !item.read && (await readData(item.news_id));
            modalizeRef.current?.open();
          }}
        />
        <Divider />
      </>
    );
  };
  return (
    <>
      <HeaderBack
        title="Notifikasi"
        search={false}
        back={() => navigation.replace('User')}
      />
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <Empty
              image="clean_inbox"
              title="Tidak ada notifikasi"
              caption="Anda akan mendapatkan update status pembelian anda disini"
            />
          )
        }
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
        ListFooterComponent={hasMore ? <ListSkeleton /> : <View />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        removeClippedSubviews
        initialNumToRender={limit}
        maxToRenderPerBatch={limit}
      />
      {data && data.length > 0 && (
        <FAB
          visible={fabShow}
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: '#1100BB',
          }}
          icon="check"
          label="Baca Semua"
          onPress={readAllData}
        />
      )}
      <Modalize
        onOpen={() => setFabShow(false)}
        onClose={() => setFabShow(true)}
        ref={modalizeRef}
        modalHeight={WINDOW_HEIGHT * 0.7}
        modalStyle={{padding: 16}}>
        <ScrollView
          style={{
            height: WINDOW_HEIGHT * 0.7 - 150,
          }}>
          <Title>{dataSelected && dataSelected.title}</Title>
          <Paragraph>{dataSelected && dataSelected.body}</Paragraph>
        </ScrollView>
        {dataSelected && dataSelected.param && (
          <Button
            onPress={() => {
              if (dataSelected && dataSelected.param) {
                const pars = dataSelected && dataSelected.param.split('/');
                if (pars[0] === 'trx') {
                  navigation.navigate('Transaction', {
                    screen: 'TransactionView',
                    params: {trxno: pars[1]},
                  });
                } else if (pars[0] === 'item') {
                  navigation.navigate('Search', {
                    screen: 'Product',
                    params: {itemid: pars[1]},
                  });
                }
              }
            }}
            style={{
              margin: 4,
              flex: 1,
              marginTop: 16,
            }}
            labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
            mode="contained">
            CEK SEKARANG
          </Button>
        )}
        <Button
          onPress={() => dataSelected && _handleDelete(dataSelected.news_id)}
          style={{
            margin: 4,
            flex: 1,
            marginTop: 16,
          }}
          labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
          color={colors.gray}
          mode="contained">
          Hapus Notifikasi
        </Button>
      </Modalize>
    </>
  );
};

export default UserNotification;
