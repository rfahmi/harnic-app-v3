import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {FAB} from 'react-native-paper';
import {RNToasty} from '@wu_rong_tai/react-native-toasty';
import HeaderBack from '../../../components/HeaderBack';
import ShippingCard from '../../../components/ShippingCard';
import {api} from '../../../configs/api';
import Empty from '../../../organism/empty';
import {useIsFocused} from '@react-navigation/native';

const UserShipping = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {user_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getData = async id => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get('/user/' + id + '/shipping', {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          RNToasty.Show({
            title: res.data.message,
            position: 'bottom',
          });
        }
        console.log(res.data);
      })
      .catch(err => {
        console.log('false');

        RNToasty.Show({
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
  }, [user_id, isFocused]);

  const keyExtractor = (item, index) => {
    return String(index + item.shipping_id);
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{justifyContent: 'center', paddingTop: 8}}
        key={`UserShipping${item.shipping_id}-${index}`}
        onPress={() =>
          navigation.push('UserShippingEdit', {
            user_id: user_id,
            id: item.shipping_id,
          })
        }>
        <ShippingCard
          name={item.shipping_name}
          address={
            item.shipping_address +
            ', ' +
            item.subdis_name +
            ', ' +
            item.dis_name +
            ', ' +
            item.city_name +
            ', ' +
            item.prov_name +
            ' ' +
            item.zip_code
          }
        />
      </TouchableOpacity>
    );
  };
  return (
    <>
      <HeaderBack title="Alamat Kirim" search={false} />
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <Empty
              image="problem_solving"
              title="Belum ada alamat"
              caption="Ayo tambahkan 1 alamat untuk mulai belanja"
              // actionLabel="Lihat Feed"
              // action={() => console.warn('aaa')}
            />
          )
        }
        contentContainerStyle={{flexGrow: 1}}
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
      />
      <FAB
        style={{position: 'absolute', margin: 16, right: 0, bottom: 0}}
        icon="plus"
        onPress={() => navigation.push('UserShippingAdd', {user_id})}
      />
    </>
  );
};

export default UserShipping;
