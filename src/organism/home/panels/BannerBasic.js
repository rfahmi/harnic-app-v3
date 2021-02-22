import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

const BannerBasic = ({data}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{marginTop: 8}}
      disabled={!data.api}
      onPress={() => {
        if (data.api) {
          switch (data.param3) {
            case 'category':
              navigation.push('Search', {
                screen: 'SearchResult',
                params: {
                  category: data.api,
                },
              });
              break;
            case 'brand':
              navigation.push('Search', {
                screen: 'SearchResult',
                params: {
                  brand: data.api,
                },
              });
              break;
            case 'product':
              navigation.push('Search', {
                screen: 'Product',
                params: {itemid: data.api},
              });
              break;
            case 'page':
              navigation.push('HomePage', {name: data.api});
              break;
            default:
              break;
          }
        }
      }}>
      <View
        style={[
          {aspectRatio: data.param1 / data.param2, backgroundColor: '#fff'},
        ]}>
        <FastImage
          style={{
            flex: 1,
          }}
          source={{
            uri: data.image,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        {data.api ? (
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              paddingVertical: 4,
              paddingHorizontal: 16,
              backgroundColor: 'orange',
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            }}>
            <Text style={{fontSize: 11, color: '#fff'}}>Lihat Semua</Text>
          </View>
        ) : (
          <View />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(BannerBasic);
