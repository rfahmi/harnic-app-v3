import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Dimensions, FlatList, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';

const Categories = ({categories, size = 3}) => {
  const navigation = useNavigation();
  const sliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    console.log(res);
    return res;
  };

  const categories_chunk = sliceIntoChunks(categories, 8);
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
            width: (Dimensions.get('window').width - 32) / size,
            aspectRatio: 1 / 1,
            margin: 2,
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{flexDirection: 'row', margin: 8}}>
      {categories_chunk.map((c) => (
        <FlatList
          data={c}
          renderItem={_renderItems}
          numColumns={size}
          horizontal={false}
          keyExtractor={keyExtractor}
        />
      ))}
    </ScrollView>
  );
};

export default memo(Categories);
