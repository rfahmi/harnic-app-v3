import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Modalize} from 'react-native-modalize';
import {
  Button,
  Divider,
  IconButton,
  List,
  TextInput,
  Title,
} from 'react-native-paper';
import {RNToasty} from '@wu_rong_tai/react-native-toasty';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import FooterBuy from '../../components/FooterBuy';
import HeaderBackTransparent from '../../components/HeaderBackTransparent';
import Separator from '../../components/Separator';
import {api} from '../../configs/api';
import {setCart} from '../../configs/redux/slice/cartSlice';
import {colors} from '../../constants/colors';
import ProductPictures from '../../organism/product/ProductPictures';
import SimilarProducts from '../../organism/product/SimilarProducts';
import VariantProducts from '../../organism/product/VariantProducts';
import ProductSkeleton from '../../organism/skeleton/ProductSkeleton';
import {isLogin} from '../../utils/auth';
import {addCart} from '../../utils/cart';
import {currencyFormat} from '../../utils/formatter';

const Product = ({navigation, route}) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const {itemid} = route.params;
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const [data, setData] = useState(null);

  //Add Cart
  const cartModal = useRef(null);
  const [loading, setLoading] = useState(false);
  const [addQty, setAddQty] = useState(1);
  const [addNote, setAddNote] = useState(null);

  const scroll = useRef(new Animated.Value(0)).current;
  const [descExpand, setDescExpand] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const scrollRef = useRef(null);
  const ongkir = useRef(null);

  const getData = async id => {
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    const append_url = user_data ? '?user_id=' + user_data.user_id : '';
    await api.get('/product/' + id + append_url).then(res => {
      if (res.data.success) {
        setData(res.data.data);
      }
    });
  };

  const _handleRefresh = () => {
    setData(null);
    setRefreshing(true);
    getData(itemid).then(() => {
      setRefreshing(false);
    });
  };

  useEffect(() => {
    getData(itemid);
  }, [itemid]);

  const openOngkir = () => {
    ongkir.current?.open();
  };

  const _toggleDesc = () => {
    descExpand ? setDescExpand(false) : setDescExpand(true);
  };

  const _handleAddCart = () => {
    setLoading(true);
    isLogin().then(login => {
      if (login) {
        addCart(itemid, addQty, addNote, true).then(d => {
          cartModal.current?.close();
          d && dispatch(setCart(d));
        });
        setLoading(false);
      } else {
        setLoading(false);
        navigation.navigate('Auth');
        RNToasty.Show({
          title: 'Login Untuk Belanja',
          position: 'center',
        });
      }
    });
  };

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="rgba(0,0,0,0.1)"
      />
      <Modalize
        ref={cartModal}
        modalHeight={WINDOW_HEIGHT * 0.5}
        modalStyle={{flex: 1, paddingHorizontal: 16}}>
        <ScrollView style={{paddingVertical: 16}}>
          <Title>Tambah ke keranjang</Title>
          <List.Item
            // style={{height: 200}}
            title={data && data.online_name}
            titleStyle={{fontSize: 12}}
            titleNumberOfLines={2}
            description={
              <View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingTop: 8,
                  }}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: 'orange',
                      }}>
                      Rp
                      {data &&
                        currencyFormat(data[auth.priceType] || data.sellprice)}
                    </Text>
                  </View>
                  {data && data.is_discount === 0 ? (
                    <View
                      style={{
                        flex: 1,
                        borderRadius: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#e63757',
                        paddingVertical: 2,
                        paddingHorizontal: 4,
                        marginLeft: 8,
                      }}>
                      <Text style={{fontSize: 8, color: '#fff'}}>
                        No Discount
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    marginTop: 8,
                  }}>
                  Subtotal: Rp{data && currencyFormat(data.sellprice * addQty)}
                </Text>
              </View>
            }
            left={() => (
              <View style={{justifyContent: 'center'}}>
                <View
                  style={{
                    width: 72,
                    aspectRatio: 1 / 1,
                    elevation: 1,
                  }}>
                  {data && (
                    <FastImage
                      source={{
                        uri: data.picture,
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: '#eee',
                        borderRadius: 1,
                      }}
                    />
                  )}
                </View>
              </View>
            )}
            right={() => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <IconButton
                    onPress={() => setAddQty(addQty - 1)}
                    disabled={addQty < 2}
                    color={colors.primary}
                    icon="minus-circle"
                  />
                  <Text>{addQty}</Text>
                  {data && (
                    <IconButton
                      onPress={() => setAddQty(addQty + 1)}
                      disabled={
                        addQty >= data.max_order || addQty >= data.stock
                      }
                      color={colors.primary}
                      icon="plus-circle"
                    />
                  )}
                </View>
                {data && data.max_order < 9999 && (
                  <View
                    style={{
                      borderRadius: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#e63757',
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      marginLeft: 8,
                    }}>
                    <Text style={{fontSize: 8, color: '#fff'}}>
                      Batas beli {data.max_order}
                    </Text>
                  </View>
                )}
                {data && data.stock < 10 && (
                  <View
                    style={{
                      borderRadius: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#555',
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      margin: 2,
                    }}>
                    <Text style={{fontSize: 8, color: '#fff'}}>
                      Stock {data.stock}
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
          <View>
            <TextInput
              style={{
                backgroundColor: '#FEF4C5',
                borderRadius: 10,
                flex: 1,
                borderColor: 'transparent',
              }}
              label="Catatan Produk"
              value={addNote}
              multiline
              mode="outlined"
              numberOfLines={3}
              placeholder="Catatan untuk produk ini (opsional)"
              onChangeText={e => setAddNote(e)}
            />
          </View>
        </ScrollView>
        <Button
          onPress={_handleAddCart}
          style={{margin: 4, flex: 1, marginVertical: 10}}
          labelStyle={{fontWeight: 'bold', fontSize: 15, lineHeight: 26}}
          color={colors.primary}
          loading={loading && <ActivityIndicator size="small" />}
          mode="contained">
          Tambah Keranjang
        </Button>
      </Modalize>
      <Modalize ref={ongkir} modalHeight={WINDOW_HEIGHT * 0.5}>
        <ScrollView style={{padding: 16}}>
          <Title>Pengiriman</Title>
          <View style={{flexDirection: 'row', marginVertical: 8}}>
            <View style={{flex: 1}}>
              <Text>Dikirim dari:</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={{textAlign: 'right'}}>
                {data && data.shipping.send_from}
              </Text>
            </View>
          </View>
          <Divider />
          <View style={{flexDirection: 'row', marginVertical: 8}}>
            <View style={{flex: 1}}>
              <Text>Penerima:</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={{textAlign: 'right'}}>
                {data && data.shipping.pic_name}
              </Text>
            </View>
          </View>
          <Divider />
          <View style={{flexDirection: 'row', marginVertical: 8}}>
            <View style={{flex: 1}}>
              <Text>Dikirim Ke:</Text>
            </View>
            <View style={{flex: 2, alignItems: 'flex-end'}}>
              <Text style={{textAlign: 'right'}}>
                {data && data.shipping.send_to}
              </Text>
            </View>
          </View>

          <Title>Ongkir</Title>
          {data &&
            data.shipping &&
            data.shipping.type &&
            data.shipping.type.map(i => (
              <>
                <View style={{flexDirection: 'row', marginVertical: 8}}>
                  <View style={{flex: 1}}>
                    <Text>{i.label}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                    }}>
                    {i.fee > 0 ? (
                      <Text style={{textAlign: 'right'}}>
                        Rp{currencyFormat(i.fee)}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: 'right',
                          fontWeight: 'bold',
                          color: colors.green,
                        }}>
                        GRATIS
                      </Text>
                    )}
                  </View>
                </View>
                <Divider />
              </>
            ))}
        </ScrollView>
      </Modalize>
      <HeaderBackTransparent
        headerOpacity={scroll.interpolate({
          inputRange: [0, 100],
          outputRange: [1, 0],
        })}
        visibility={scroll.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 1],
        })}
        shareData={
          data
            ? {
                url: 'https://harnic.id/product/' + itemid,
                title: data.online_name,
                message: `Temukan ${data.online_name} termurah, dan pasti gratis ongkir di harnic`,
              }
            : null
        }
      />
      {!data ? (
        <ProductSkeleton />
      ) : (
        <>
          <Animated.ScrollView
            ref={scrollRef}
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
            style={{backgroundColor: '#fff'}}>
            <View
              style={{
                aspectRatio: 1 / 1,
                position: 'relative',
                justifyContent: 'center',
              }}>
              {data.stock < 1 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}>
                    HABIS
                  </Text>
                </View>
              )}
              {data ? (
                <ProductPictures
                  pictures={data.media}
                  video={data.youtube_video}
                  parentScrollView={scrollRef.current}
                />
              ) : (
                <ActivityIndicator size="large" color={colors.gray} />
              )}
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: '#fff',
                  bottom: -10,
                  padding: 4,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                  right: 0,
                  elevation: 2,
                }}>
                <Image
                  source={require('../../assets/images/xpress-label-b.png')}
                  style={{
                    height: 22,
                    aspectRatio: 5 / 1,
                    alignItems: 'center',
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Divider />
            <View style={{padding: 16}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'orange',
                  }}>
                  Rp
                  {data && data.is_promo
                    ? currencyFormat(data.sellprice)
                    : currencyFormat(data[auth.priceType] || data.sellprice)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                {auth.priceType !== 'sellprice' && !data.is_promo && (
                  <View
                    style={{
                      backgroundColor: 'orange',
                      padding: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      marginRight: 4,
                    }}>
                    <Text style={{fontSize: 10, color: '#fff'}}>
                      SPECIAL PRICE
                    </Text>
                  </View>
                )}
                {data && data.sellprice2 > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: 'orange',
                        // width: 26,
                        // aspectRatio: 1 / 1,
                        padding: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                      }}>
                      <Text style={{fontSize: 10, color: '#fff'}}>
                        {data.discount} OFF
                      </Text>
                    </View>
                    {data && data.price_slash > 0 ? (
                      <Text
                        style={{
                          fontSize: 10,
                          color: '#555',
                          marginBottom: 4,
                          marginLeft: 8,
                          textDecorationLine: 'line-through',
                        }}>
                        {'Rp' + currencyFormat(data.price_slash)}
                      </Text>
                    ) : (
                      data.sellprice2 > 0 && (
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#555',
                            marginBottom: 4,
                            marginLeft: 8,
                            textDecorationLine: 'line-through',
                          }}>
                          {'Rp' +
                            currencyFormat(
                              data[auth.priceType] > 0
                                ? data.sellprice2 > data.sellprice
                                  ? data.sellprice2
                                  : data.sellprice
                                : data.sellprice2,
                            )}
                        </Text>
                      )
                    )}
                  </View>
                )}
              </View>

              <Text style={{fontSize: 12, color: '#555'}} numberOfLines={2}>
                {data && data.BrandName.toUpperCase()}
              </Text>
              <Text
                style={{fontSize: 18, fontWeight: 'bold'}}
                numberOfLines={2}>
                {data && data.online_name}
              </Text>
              <Text style={{fontSize: 12, marginVertical: 8}} numberOfLines={3}>
                {data && data.item_desc}
              </Text>
              {data && data.variants && (
                <VariantProducts items={data.variants} />
              )}
            </View>

            <Separator />

            <List.Item
              onPress={() =>
                data.shipping.pic_name
                  ? openOngkir()
                  : navigation.navigate('Auth')
              }
              title="Ongkir"
              titleStyle={{fontWeight: 'bold'}}
              description={
                data.shipping.pic_name
                  ? 'Lihat ongkir disini'
                  : 'Log In untuk melihat ongkir'
              }
              style={{elevation: 5}}
              right={() => <List.Icon icon="chevron-right" />}
            />

            {data && data.item_long_desc.length > 5 && (
              <>
                <Separator />
                <View style={{padding: 16}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    Deskripsi Lengkap
                  </Text>

                  <TouchableOpacity onPress={_toggleDesc}>
                    <Text numberOfLines={descExpand ? 0 : 6}>
                      {data && data.item_long_desc}
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        height: 24,
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon
                          name={descExpand ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={colors.primary}
                        />
                        <Text
                          style={{fontStyle: 'italic', color: colors.primary}}>
                          {descExpand
                            ? 'Lihat Lebih Sedikit'
                            : 'Lihat Lebih Banyak'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {data && data.review_count > 0 && (
              <>
                <Separator />
                <View style={{padding: 16}}>
                  <TouchableOpacity
                    disabled={data && data.review_count < 1}
                    onPress={() =>
                      navigation.push('ProductReview', {
                        rating_avg: data && data.rating_avg,
                        rating_avg_formatted: data && data.rating_avg_formatted,
                        reviews: data && data.reviews,
                      })
                    }>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>
                          Ulasan Pembeli
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={{fontSize: 12}}>
                            {data && data.review_count} Ulasan
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          flex: 1,
                        }}>
                        <Icon name="star" size={24} color={colors.goldYellow} />
                        <Text style={{fontWeight: 'bold', fontSize: 24}}>
                          {data && data.rating_avg_formatted}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <Icon
                        name="chevron-down"
                        size={18}
                        color={colors.primary}
                      />
                      <Text
                        style={{fontStyle: 'italic', color: colors.primary}}>
                        Lihat Semua Ulasan
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <Separator />

            {data && <SimilarProducts category={data.cat_id} />}
          </Animated.ScrollView>
          <SafeAreaView>
            {data.stock > 0 && (
              <FooterBuy
                item={data}
                openModal={() => cartModal.current?.open()}
              />
            )}
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default memo(Product);
