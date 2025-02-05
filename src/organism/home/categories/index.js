import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {useRef} from 'react';
import {Dimensions, FlatList, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';

const Categories = ({categories, size = 3, parentScrollViewRef}) => {
  const refCategoryGridMainList = useRef(null);
  const navigation = useNavigation();
  const sliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  };

  const categories_chunk = sliceIntoChunks(categories, 8);
  const ITEM_WIDTH =
    categories_chunk.length === 1
      ? (Dimensions.get('window').width - 32) / size
      : ((Dimensions.get('window').width - 32) / size) * 1.15;
  const _renderItems = ({item}) => {
    return (
      <TouchableOpacity
        key={'cat' + item.cat_id}
        onPress={() => {
          if (item.custom_page2_url) {
            if (!item.custom_page2_url === '#') {
              alert('Coming Soon!');
            } else {
              const url = item.custom_page2_url.split('://');
              if (url[0] === 'https') {
                const name = item.custom_page2_url.replace(
                  'https://page.harnic.id/url/',
                  '',
                );
                navigation.push('HomePage', {name});
              } else if (url[0] === 'screen') {
                navigation.push(url[1]);
              }
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
            width: ITEM_WIDTH,
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
    return String('maincat' + index + item.cat_id);
  };
  return (
    <ScrollView
      ref={refCategoryGridMainList}
      parentScrollViewRef={parentScrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{flexDirection: 'row', margin: 8}}>
      {categories_chunk.map((c, index) => {
        const numColumns = Math.ceil(c.length / 2);
        return (
          <FlatList
            parentScrollViewRef={refCategoryGridMainList.current}
            key={'listCatItem' + index}
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

export default memo(Categories);
