import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {List} from 'react-native-paper';
import HarnicToast from '@components/HarnicToast';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';
import Empty from '../../../organism/empty';

const UserPoint = ({navigation, route}) => {
  const {user_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getData = async id => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get('/user/' + id + '/point', {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        console.log(res.data.data);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          HarnicToast.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
        console.log(res.data);
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
    getData(user_id)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    getData(user_id)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [user_id]);

  const keyExtractor = (item, index) => {
    return String(index + item.card_id);
  };
  const _renderItems = ({item, index}) => {
    return (
      <List.Item
        key={item.id + index}
        title={item.point_value}
        titleStyle={{fontWeight: 'bold'}}
        description={item.ref}
        descriptionStyle={{fontSize: 12}}
        left={() => <List.Icon icon="circle-slice-8" color="#EFC910" />}
      />
    );
  };
  return (
    <>
      <HeaderBack title="Riwayat Poin" search={false} />
      <FlatList
        style={{backgroundColor: '#fff'}}
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <Empty
              image="clean_inbox"
              title="Belum ada transaksi"
              caption="Ayo perbanyak belanja di harnic dan dapatkan cashbacknya"
            />
          )
        }
        contentContainerStyle={{flexGrow: 1}}
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
      />
    </>
  );
};

export default UserPoint;
