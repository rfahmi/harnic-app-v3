import {useScrollToTop} from '@react-navigation/native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {Animated, Image, RefreshControl, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {api} from '../../configs/api';
import {setAuth, setPriceType} from '../../configs/redux/action/authActions';
import Banners from '../../organism/home/banners';
import Categories from '../../organism/home/categories';
import HomeIcons from '../../organism/home/icons';
import Panels from '../../organism/home/panels';
import TopBar from '../../organism/home/topbar';
import HomeSkeleton from '../../organism/skeleton/HomeSkeleton';
import {isLogin} from '../../utils/auth';
import {setCart} from '../../configs/redux/action/cartActions';
import {setSuggestion} from '../../configs/redux/action/suggestionActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FAB} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors} from '../../constants/colors';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const [config, setConfig] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const refList = useRef(null);
  useScrollToTop(refList);
  const scroll = useRef(new Animated.Value(0)).current;

  const getConfig = async () => {
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    let append_url = user_data ? '?user_id=' + user_data.user_id : '';
    // if (__DEV__) {
    //   append_url = '/debug' + append_url;
    // }
    const result = await api
      .get('/configs' + append_url)
      .then(res => {
        if (res.data.success) {
          // console.log(res.data.data?.user);
          if (res.data.data?.maintenance == 1) {
            throw new Error('Maintenance Mode');
          }
          return res.data.data;
        } else {
          throw new Error('gagal');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        navigation.navigate('Maintenance');
      });
    return result;
  };
  const _handleRefresh = () => {
    setConfig(null);
    setRefreshing(true);
    isLogin().then(async r => {
      const d = JSON.parse(await AsyncStorage.getItem('user_data'));
      if (r) {
        dispatch(setAuth(true));
        dispatch(setPriceType(d.price_type));
      } else {
        dispatch(setAuth(false));
        dispatch(setPriceType('sellprice'));
      }
    });
    getConfig().then(d => {
      setConfig(d);
      dispatch(setCart(d.cart));
      dispatch(setSuggestion(d.keywords));
      setRefreshing(false);
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    getConfig().then(d => {
      if (isSubscribed) {
        setConfig(d);
        dispatch(setCart(d.cart));
        dispatch(setSuggestion(d.keywords));
      }
    });
    isLogin().then(async r => {
      const d = JSON.parse(await AsyncStorage.getItem('user_data'));
      if (r) {
        dispatch(setAuth(true));
        dispatch(setPriceType(d.price_type));
      } else {
        dispatch(setAuth(false));
        dispatch(setPriceType('sellprice'));
      }
    });
    return () => (isSubscribed = false);
  }, []);

  const _renderTop = () => {
    return (
      <View style={{alignItems: 'stretch', justifyContent: 'center'}}>
        <Banners
          banners={config && config.banners}
          parentScrollView={refList.current}
          warning={config && config.warning}
        />
        {config &&
          config.user &&
          config.user.user_id &&
          !config.user.has_password && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.note,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
              onPress={() =>
                navigation.navigate('User', {
                  screen: 'UserPassword',
                  params: {user_id: config.user.user_id},
                })
              }>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                Anda belum membuat password!
              </Text>
              <Text style={{fontSize: 11}}>
                Tekan disini untuk membuat password baru
              </Text>
            </TouchableOpacity>
          )}
        <HomeIcons />
        <Categories
          categories={config.categories}
          size={config.category_size || 4}
          parentScrollViewRef={refList.current}
        />
      </View>
    );
  };
  const _renderPanel = useCallback(({item, index}) => {
    return <Panels data={item} parentScrollViewRef={refList.current} />;
  }, []);

  const keyExtractor = (item, index) => {
    return `Panel${item.component_id}-${index}`;
  };

  return (
    <>
      <TopBar
        auth={auth}
        headerOpacity={scroll.interpolate({
          inputRange: [0, 300],
          outputRange: [1, 0],
        })}
        visibility={scroll.interpolate({
          inputRange: [0, 300],
          outputRange: [0, 1],
        })}
      />
      {!config ? (
        <HomeSkeleton />
      ) : (
        <>
          <Animated.FlatList
            ref={refList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={_handleRefresh}
              />
            }
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scroll}}}],
              {useNativeDriver: true},
            )}
            scrollEventThrottle={16}
            data={config.panels}
            ListHeaderComponent={_renderTop}
            ListFooterComponent={() =>
              config.panels && (
                <View style={{alignItems: 'center', paddingVertical: 16}}>
                  <Text style={{color: '#555'}}>Supported Payments:</Text>
                  <View style={{flexDirection: 'row', paddingHorizontal: 32}}>
                    <Image
                      style={{flex: 1}}
                      resizeMode="contain"
                      source={require('../../assets/images/payment/cod.png')}
                    />
                    <Image
                      style={{flex: 1}}
                      resizeMode="contain"
                      source={require('../../assets/images/payment/va.png')}
                    />
                    <Image
                      style={{flex: 1}}
                      resizeMode="contain"
                      source={require('../../assets/images/payment/visa.png')}
                    />
                    <Image
                      style={{flex: 1}}
                      resizeMode="contain"
                      source={require('../../assets/images/payment/mc.png')}
                    />
                  </View>
                  <Text style={{color: '#555'}}>PT. Harnic Online Store</Text>
                </View>
              )
            }
            renderItem={_renderPanel}
            keyExtractor={keyExtractor}
            removeClippedSubviews
            nestedScrollEnabled
            initialNumToRender={3}
            maxToRenderPerBatch={3}
          />
          <FAB
            visible={!auth.isLogin}
            style={{
              position: 'absolute',
              margin: 16,
              right: '20%',
              left: '20%',
              bottom: 0,
              backgroundColor: '#1100BB',
            }}
            label="Log In"
            small
            icon="login"
            onPress={() => navigation.push('Auth')}
          />
          <FAB
            style={{
              position: 'absolute',
              margin: 16,
              right: 0,
              bottom: 0,
              backgroundColor: '#1100BB',
              opacity: scroll.interpolate({
                inputRange: [0, 300],
                outputRange: [0, 1],
              }),
            }}
            small
            icon="chevron-up"
            onPress={() =>
              refList.current.scrollToOffset({animated: true, offset: 0})
            }
          />
        </>
      )}
    </>
  );
};

export default Home;
