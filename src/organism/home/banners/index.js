import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, View} from 'react-native';
import Carousel from 'react-native-smart-carousel';

const Banners = ({banners, parentScrollView}) => {
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
            autoPlay={false}
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
                  alert('Action Unknown');
                  break;
              }
            }}
            navigation={true}
            navigationColor={'#ffffff'}
            navigationType="dot"
          />
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
