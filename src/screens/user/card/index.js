import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Divider, List} from 'react-native-paper';
import {RNToasty} from 'react-native-toasty';
import CreditCard from '../../../components/CreditCard';
import HeaderBack from '../../../components/HeaderBack';
import {api} from '../../../configs/api';
import Empty from '../../../organism/empty';

const UserCard = ({navigation, route}) => {
  const {user_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dataSelected, setDataSelected] = useState(null);
  const modalizeRef = useRef(null);

  const getData = async id => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get('/user/' + id + '/card', {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
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
      .catch(err => {
        console.log('false');

        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const deleteData = async id => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .delete('/user/' + user_id + '/card/' + id, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          RNToasty.Success({
            title: res.data.message,
            position: 'bottom',
          });
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'bottom',
          });
        }
      })
      .catch(err => {
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
  const _handleDelete = card_id => {
    setLoading(true);
    deleteData(card_id)
      .then(() => {
        getData(user_id);
        modalizeRef.current?.close();
      })
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
        key={`UserCard${item.card_id}-${index}`}
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
      <HeaderBack title="Kartu Kredit" search={false} />
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_handleRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <Empty
              image="card_payment"
              title="Belum ada kartu terdaftar"
              caption="Silahkan gunakan kartu kredit saat pembayaran"
            />
          )
        }
        contentContainerStyle={{flexGrow: 1}}
        renderItem={_renderItems}
        horizontal={false}
        keyExtractor={keyExtractor}
      />
      <Modalize ref={modalizeRef} modalHeight={80}>
        <List.Item
          title="Hapus"
          right={() => <List.Icon icon="delete" />}
          onPress={() => _handleDelete(dataSelected)}
        />
        <Divider />
      </Modalize>
    </>
  );
};

export default UserCard;
