import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import BannerItem from '../../../components/BannerItem';

const BannerGridSlide = ({data}) => {
  const navigation = useNavigation();
  const size = data.param1;
  const item_per_chunk = size * 2;
  const sliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  };
  const items_chunk = sliceIntoChunks(data.items, item_per_chunk);
  const ITEM_WIDTH =
    items_chunk.length === 1
      ? (Dimensions.get('window').width - 32) / size
      : ((Dimensions.get('window').width - 32) / size) * 1.15;

  const keyExtractor = (item, index) => {
    return String(`BannerGridSlide${item.banner_id}-${index}`);
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
              case 'screen':
                navigation.push(item.param);
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
            width: ITEM_WIDTH,
            margin: 2,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{backgroundColor: '#fff'}}>
      {items_chunk.map((c, index) => {
        const numColumns = Math.ceil(c.length / 2);
        return (
          <FlatList
            key={'list' + index}
            data={c}
            renderItem={_renderItems}
            numColumns={numColumns}
            horizontal={false}
            keyExtractor={keyExtractor}
          />
        );
      })}
    </ScrollView>
  );
};

export default memo(BannerGridSlide);
