import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, TouchableOpacity, View, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CartCounter from './CartCounter';
import {getStatusBarHeight} from 'react-native-safearea-height';
import Share from 'react-native-share';

const HeaderBackSearch = ({shareData}) => {
  const navigation = useNavigation();
  const _goBack = () => navigation.goBack();
  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;

  const _handleSearch = () => navigation.push('Search', {key: Date.now()});
  const _handleCart = () => navigation.navigate('Cart');
  const _handleHome = () => navigation.navigate('App', {screen: 'Home'});
  const _handleShare = ({url, title, message}) => {
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            // For sharing url with custom title.
            placeholderItem: {type: 'url', content: url},
            item: {
              default: {type: 'url', content: url},
            },
            subject: {
              default: title,
            },
            linkMetadata: {originalUrl: url, url, title},
          },
          {
            // For sharing text.
            placeholderItem: {type: 'text', content: message},
            item: {
              default: {type: 'text', content: message},
              message: null, // Specify no text to share via Messages app.
            },
            linkMetadata: {
              // For showing app icon on share preview.
              title: message,
            },
          },
        ],
      },
      default: {
        title,
        subject: title,
        message: `${message} ${url}`,
      },
    });

    Share.open(options);
  };

  return (
    <>
      <View
        style={{
          marginTop: STATUSBAR_HEIGHT,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          paddingHorizontal: 8,
          paddingVertical: 8,
          zIndex: 1,
        }}>
        <TouchableOpacity
          onPress={_goBack}
          style={{
            backgroundColor: 'transparent',
            zIndex: 1,
            padding: 8,
            aspectRatio: 1 / 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
          }}>
          <Icon name="arrow-left" size={22} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#eee',
            borderRadius: 8,
            padding: 8,
            flex: 1,
            opacity: 1,
          }}
          onPress={_handleSearch}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon color="#999" size={14} name="magnify" />
            <Text style={{fontSize: 14, color: '#999', marginLeft: 5}}>
              Cari produk
            </Text>
          </View>
        </TouchableOpacity>
        {shareData && (
          <TouchableOpacity
            onPress={() => _handleShare(shareData)}
            style={{
              backgroundColor: 'transparent',

              zIndex: 1,
              padding: 8,
              marginLeft: 4,
              aspectRatio: 1 / 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 100,
            }}>
            <Icon name="share-variant" size={22} color="#555" />
          </TouchableOpacity>
        )}
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={_handleCart}
            style={{
              backgroundColor: 'transparent',
              zIndex: 1,
              padding: 8,
              aspectRatio: 1 / 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 100,
            }}>
            <>
              <Icon name="cart" size={22} color="#555" />
              <CartCounter style={{top: 0, right: 0}} />
            </>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={_handleHome}
            style={{
              backgroundColor: 'transparent',
              zIndex: 1,
              padding: 8,
              aspectRatio: 1 / 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 100,
            }}>
            <Icon name="home" size={22} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default HeaderBackSearch;
