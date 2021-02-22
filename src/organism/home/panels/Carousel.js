import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, FlatList, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

const Carousel = ({data}) => {
  const navigation = useNavigation();
  const keyExtractor = (item, index) => {
    return String(`Carousel${item.banner_id}-${index}`);
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.action) {
            switch (item.action) {
              case 'category':
                navigation.push('Search', {
                  screen: 'SearcResult',
                  params: {
                    category: item.param,
                  },
                });
                break;
              case 'brand':
                navigation.push('Search', {
                  screen: 'SearcResult',
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
                console.log('Not action');
                break;
            }
          } else {
            console.log('Not action');
          }
        }}>
        <View
          style={[
            {
              width: Dimensions.get('window').width,
              aspectRatio: 3 / 1,
              backgroundColor: '#eee',
            },
          ]}>
          <FastImage
            style={{
              flex: 1,
            }}
            source={{
              uri: item.banner_url,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={data.items}
      renderItem={_renderItems}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      horizontal
      keyExtractor={keyExtractor}
    />
  );
};

export default memo(Carousel);
