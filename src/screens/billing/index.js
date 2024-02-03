import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, RefreshControl, StatusBar, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {RNToasty} from '@wu_rong_tai/react-native-toasty';
import {useSelector} from 'react-redux';
import HeaderBackSearch from '../../components/HeaderBackSearch';
import {api} from '../../configs/api';

const Billing = ({navigation}) => {
  const auth = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const ITEM_WIDTH = (Dimensions.get('window').width - 32) / 3;

  const getService = async () => {
    await api
      .get('/billing/prepaid/services')
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        RNToasty.Show({
          title: err.message,
          position: 'bottom',
        });
      });
  };

  const _handleRefresh = () => {
    setRefreshing(true);
    getService()
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => setRefreshing(false));
  };

  useEffect(() => {
    setRefreshing(true);
    getService()
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => setRefreshing(false));
  }, []);

  const _renderItems = ({item}) => {
    return (
      <TouchableOpacity
        key={'service' + item.id}
        onPress={() => {
          auth.isLogin
            ? item.status == 1
              ? navigation.push('BillingProducts', {
                  service: item,
                })
              : Alert.alert('Oopps!', 'Layanan ini belum tersedia saat ini')
            : navigation.navigate('Auth');
        }}>
        <View
          style={{
            width: ITEM_WIDTH,
            aspectRatio: 1 / 1,
            margin: 2,
          }}>
          <FastImage
            style={{
              width: undefined,
              height: undefined,
              flex: 1,
              borderRadius: 10,
            }}
            source={{
              uri: item.logo,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <StatusBar
        translucent={false}
        barStyle="dark-content"
        backgroundColor="rgba(0,0,0,0.1)"
      />
      <HeaderBackSearch />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_handleRefresh} />
        }
        contentContainerStyle={{
          padding: 8,
        }}
        key={'prepaidServices'}
        data={data}
        renderItem={_renderItems}
        numColumns={3}
        horizontal={false}
        // keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default Billing;
