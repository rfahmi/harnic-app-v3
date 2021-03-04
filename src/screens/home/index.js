import {useScrollToTop} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Image, RefreshControl, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {api} from '../../configs/api';
import {setAuth} from '../../configs/redux/action/authActions';
import Banners from '../../organism/home/banners';
import Categories from '../../organism/home/categories';
import HomeIcons from '../../organism/home/icons';
import Panels from '../../organism/home/panels';
import TopBar from '../../organism/home/topbar';
import HomeSkeleton from '../../organism/skeleton/HomeSkeleton';
import {isLogin} from '../../utils/auth';
import {setCart} from '../../configs/redux/action/cartActions';
import {setSuggestion} from '../../configs/redux/action/suggestionActions';
import AsyncStorage from '@react-native-community/async-storage';
import {FAB} from 'react-native-paper';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [config, setConfig] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const refList = useRef(null);
  useScrollToTop(refList);
  const scroll = useRef(new Animated.Value(0)).current;

  const getConfig = async () => {
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    let append_url = user_data ? '?user_id=' + user_data.user_id : '';
    if (__DEV__) {
      append_url = '/debug' + append_url;
    }
    const result = await api
      .get('/configs' + append_url)
      .then((res) => {
        if (res.data.success) {
          return res.data.data;
        } else {
          console.log('gagal');
        }
      })
      .catch((err) => {
        console.log('Error:', err);
      });
    return result;
  };
  const _handleRefresh = () => {
    setConfig(null);
    setRefreshing(true);
    isLogin().then((r) =>
      r ? dispatch(setAuth(true)) : dispatch(setAuth(false)),
    );
    getConfig().then((d) => {
      setConfig(d);
      dispatch(setCart(d.cart));
      dispatch(setSuggestion(d.keywords));
      setRefreshing(false);
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    getConfig().then((d) => {
      if (isSubscribed) {
        setConfig(d);
        dispatch(setCart(d.cart));
        dispatch(setSuggestion(d.keywords));
      }
    });
    isLogin().then((r) =>
      r ? dispatch(setAuth(true)) : dispatch(setAuth(false)),
    );
    return () => (isSubscribed = false);
  }, []);

  const _renderTop = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <Banners banners={config.banners} parentScrollView={refList.current} />
        <HomeIcons />
        <Categories categories={config.categories} />
      </View>
    );
  };
  const _renderPanel = ({item, index}) => {
    return <Panels data={item} />;
  };

  const keyExtractor = (item, index) => {
    return String(`Panel${item.component_id}-${index}-${Date.now()}`);
  };

  return (
    <>
      <TopBar
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
