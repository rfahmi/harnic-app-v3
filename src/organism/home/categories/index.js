import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, FlatList, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

const Categories = ({categories, size = 3}) => {
  const navigation = useNavigation();
  const _renderItems = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.custom_page2_url) {
            if (!item.custom_page2_url === '#') {
              alert('Coming Soon!');
            } else {
              const name = item.custom_page2_url.replace(
                'https://page.harnic.id/url/',
                '',
              );
              navigation.push('HomePage', {name});
            }
          } else {
            navigation.push('Search', {
              screen: 'SearchResult',
              params: {
                category: item.cat_id,
              },
            });
          }
        }}>
        <View
          style={{
            width: (Dimensions.get('window').width - 16) / size,
            aspectRatio: 1 / 1,
            borderWidth: 2,
            borderColor: 'transparent',
          }}>
          <FastImage
            style={{
              width: undefined,
              height: undefined,
              flex: 1,
              borderRadius: 10,
            }}
            source={{
              uri: item.poster2,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const keyExtractor = (item, index) => {
    return String(index + item.cat_id);
  };
  return (
    <FlatList
      data={categories}
      style={{marginVertical: 8}}
      renderItem={_renderItems}
      numColumns={size}
      horizontal={false}
      keyExtractor={keyExtractor}
    />
  );
};

export default memo(Categories);
