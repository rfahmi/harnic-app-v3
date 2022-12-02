import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {RNToasty} from 'react-native-toasty';
import CreditCard from '../../../components/CreditCard';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';
import Empty from '../../../organism/empty';

const UserBilling = ({navigation, route}) => {
  const {user_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dataSelected, setDataSelected] = useState(null);
  const modalizeRef = useRef(null);

  const getData = async (id) => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get('/user/' + id + '/billing/prepaid', {
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
    return String(index + item.card_id);
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          paddingTop: 8,
        }}
        key={`UserBilling${item.card_id}-${index}`}
        onPress={() => {
          setDataSelected(item.card_id);
          modalizeRef.current?.open();
        }}>
        <CreditCard
          num={item.card_num}
          holder={item.card_holder}
          cvc={item.card_cvc}
          exp={item.card_exp}
        />
      </TouchableOpacity>
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
              image="card_payment"
              title="Belum Ada Transaksi Topup"
              caption="Topup pulsa dan data lewat harnic sekarang"
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

export default UserBilling;
