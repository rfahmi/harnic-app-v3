import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

const BannerGridV2 = ({data, parentScrollViewRef = null}) => {
  console.log('AAA', data.items[0].banner_url);
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        gap: 4,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={{flex: 1, backgroundColor: '#eee'}}
          onPress={() => {
            if (data.items[0].action) {
              switch (data.items[0].action) {
                case 'category':
                  navigation.push('Search', {
                    screen: 'SearchResult',
                    params: {
                      category: data.items[0].param,
                    },
                  });
                  break;
                case 'brand':
                  navigation.push('Search', {
                    screen: 'SearchResult',
                    params: {
                      brand: data.items[0].param,
                    },
                  });
                  break;
                case 'product':
                  navigation.push('Search', {
                    screen: 'Product',
                    params: {itemid: data.items[0].param},
                  });
                  break;
                case 'page':
                  navigation.push('HomePage', {name: data.items[0].param});
                  break;
                case 'screen':
                  navigation.push(data.items[0].param);
                  break;
                default:
                  break;
              }
            }
          }}>
          <Image
            source={{uri: data.items[0].banner_url}}
            style={{flex: 1, resizeMode: 'cover'}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, flexDirection: 'column', gap: 4}}>
        <TouchableOpacity
          style={{flex: 1, aspectRatio: 2, backgroundColor: '#eee'}}
          onPress={() => {
            if (data.items[1].action) {
              switch (data.items[1].action) {
                case 'category':
                  navigation.push('Search', {
                    screen: 'SearchResult',
                    params: {
                      category: data.items[1].param,
                    },
                  });
                  break;
                case 'brand':
                  navigation.push('Search', {
                    screen: 'SearchResult',
                    params: {
                      brand: data.items[1].param,
                    },
                  });
                  break;
                case 'product':
                  navigation.push('Search', {
                    screen: 'Product',
                    params: {itemid: data.items[1].param},
                  });
                  break;
                case 'page':
                  navigation.push('HomePage', {name: data.items[1].param});
                  break;
                case 'screen':
                  navigation.push(data.items[1].param);
                  break;
                default:
                  break;
              }
            }
          }}>
          <Image
            source={{uri: data.items[1].banner_url}}
            style={{flex: 1, resizeMode: 'cover'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{flex: 1, aspectRatio: 2, backgroundColor: '#eee'}}
          onPress={() => {
            if (data.items[2].action) {
              switch (data.items[2].action) {
                case 'category':
                  navigation.push('Search', {
                    screen: 'SearchResult',
                    params: {
                      category: data.items[2].param,
                    },
                  });
                  break;
                case 'brand':
                  navigation.push('Search', {
                    screen: 'SearchResult',
                    params: {
                      brand: data.items[2].param,
                    },
                  });
                  break;
                case 'product':
                  navigation.push('Search', {
                    screen: 'Product',
                    params: {itemid: data.items[2].param},
                  });
                  break;
                case 'page':
                  navigation.push('HomePage', {name: data.items[2].param});
                  break;
                case 'screen':
                  navigation.push(data.items[2].param);
                  break;
                default:
                  break;
              }
            }
          }}>
          <Image
            source={{uri: data.items[2].banner_url}}
            style={{flex: 1, resizeMode: 'cover'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(BannerGridV2);
