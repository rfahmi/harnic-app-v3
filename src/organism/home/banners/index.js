import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, View, Text} from 'react-native';
import Carousel from 'react-native-smart-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Banners = ({banners, parentScrollView, warning}) => {
  const navigation = useNavigation();
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const BANNER_HEIGHT = WINDOW_WIDTH * 0.75;
  const banner = (id) => {
    const idx = banners.findIndex((x) => x.id === id);
    return banners[idx];
  };
  return (
    <View style={{position: 'relative'}}>
      {banners ? (
        <>
          <Carousel
            parentScrollViewRef={parentScrollView}
            data={banners}
            autoPlay={true}
            height={BANNER_HEIGHT}
            onPress={(e) => {
              const b = banner(e);
              switch (b.action) {
                case 'category':
                  navigation.push('Search', {
                    screen: 'SearchResult',
                    params: {
                      category: b.param,
                    },
                  });
                  break;
                case 'brand':
                  navigation.push('Search', {
                    screen: 'SearchResult',
                    params: {
                      brand: b.param,
                    },
                  });
                  break;
                case 'product':
                  navigation.push('Search', {
                    screen: 'Product',
                    params: {itemid: b.param},
                  });
                  break;
                case 'page':
                  navigation.push('HomePage', {name: b.param});
                  break;
                default:
                  break;
              }
            }}
            navigation={true}
            navigationColor={'#ffffff'}
            navigationType="dot"
          />
          {warning && warning.show && warning.message && (
            <View
              style={{
                flex: 1,
                backgroundColor: '#CE3F40',
                padding: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon name="alert-octagon" size={24} color="#fff" />
              <Text style={{color: '#fff', marginLeft: 4, flex: 1}}>
                {warning.message}
              </Text>
            </View>
          )}
        </>
      ) : (
        <View
          style={{
            height: BANNER_HEIGHT,
            backgroundColor: '#ccc',
            width: WINDOW_WIDTH,
          }}
        />
      )}
    </View>
  );
};

export default memo(Banners);
