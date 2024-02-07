import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import HarnicToast from '@components/HarnicToast';
import ScreenTitle from '../../components/ScreenTitle';
import {api} from '../../configs/api';
import Empty from '../../organism/empty';
import ShopListItem from './ShopListItem';

const Shoplist = ({navigation}) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);
  const getData = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

    await api
      .get('/user/' + user_data.user_id + '/shoppinglist', {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
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
  const deleteData = async id => {
    console.log('deleted');
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

    await api
      .delete('/user/' + user_data.user_id + '/shoppinglist/' + id, {
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
        console.log('false');

        HarnicToast.Show({
          title: err.message,
          position: 'center',
        });
      });
  };

  const _handleRefresh = () => {
    setData(null);
    setLoading(true);
    getData()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    getData()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [isFocused]);

  const _renderItems = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push('Search', {
            screen: 'Product',
            params: {itemid: item.itemid},
          })
        }>
        <ShopListItem item={item} deleteShoppingList={id => deleteData(id)} />
      </TouchableOpacity>
    );
  };
  const keyExtractor = (item, index) => {
    return String('ShopList' + index + item.item_id);
  };

  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}
        ListHeaderComponent={() => <ScreenTitle title="Shoplist" />}
        ListEmptyComponent={
          !loading && (
            <Empty
              image="online_shopping"
              title="Belum ada produk"
              caption="Selesaikan pesanan anda agar shoplist anda bertambah"
              actionLabel="Belanja Sekarang"
              action={() => navigation.navigate('Home')}
            />
          )
        }
        data={data}
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
      />
    </>
  );
};

export default Shoplist;
