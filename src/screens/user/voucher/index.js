import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {Divider, List} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import HeaderBack from '../../../components/HeaderBack';
import VoucherCard from '../../../components/VoucherCard';
import {api} from '../../../configs/api';
import Empty from '../../../organism/empty';

const UserVoucher = ({navigation, route}) => {
  const {user_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getData = async (id) => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get('/user/' + id + '/voucher', {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
        console.log(res.data);
      })
      .catch((err) => {
        console.log('false');

        RNToasty.Error({
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
    return String(index + item.vc_id);
  };
  const _renderItems = ({item, index}) => {
    return (
      <View style={{justifyContent: 'center', paddingTop: 8}}>
        <VoucherCard data={item} />
      </View>
    );
  };
  return (
    <>
      <HeaderBack title="Kode Voucher" search={false} />
      <FlatList
        data={data}
        ListEmptyComponent={
          !loading && (
            <Empty
              image="marketing"
              title="Tidak ada voucher"
              caption="Lihat menu feed untuk mendapatkan promosi terbaru"
              actionLabel="Lihat Feed"
              action={() => navigation.navigate('Feed')}
            />
          )
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
      />
    </>
  );
};

export default UserVoucher;
