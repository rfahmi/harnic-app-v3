import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, FlatList, Platform, TouchableOpacity} from 'react-native';
import BannerItem from '../../../components/BannerItem';

const BannerGrid = ({data}) => {
  const navigation = useNavigation();
  const keyExtractor = (item, index) => {
    return String(`BannerGrid${item.banner_id}-${index}`);
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.action) {
            switch (item.action) {
              case 'category':
                navigation.push('Search', {
                  screen: 'SearchResult',
                  params: {
                    category: item.param,
                  },
                });
                break;
              case 'brand':
                navigation.push('Search', {
                  screen: 'SearchResult',
                  params: {
                    brand: item.param,
                  },
                });
                break;
              case 'product':
                navigation.push('Search', {
                  screen: 'Product',
                  params: {itemid: item.param},
                });
                break;
              case 'page':
                navigation.push('HomePage', {name: item.param});
                break;
              default:
                break;
            }
          }
        }}>
        <BannerItem
          image={
            Platform.OS === 'ios' && item.banner_url_ios
              ? item.banner_url_ios
              : item.banner_url
          }
          aspect={data.param2 || 1}
          style={{
            width: Dimensions.get('window').width / data.param1 - 4,
            margin: 2,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={data.items}
      style={{backgroundColor: '#fff'}}
      renderItem={_renderItems}
      numColumns={data.param1}
      horizontal={false}
      keyExtractor={keyExtractor}
    />
  );
};

export default memo(BannerGrid);
