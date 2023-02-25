import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Banners = memo(({banners, parentScrollView, warning}) => {
  const navigation = useNavigation();
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity onPress={() => onBannerPress(item)}>
        <Image source={{uri: item.imagePath}} style={styles.image} />
      </TouchableOpacity>
    ),
    [],
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const onBannerPress = useCallback(
    (b) => {
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
        case 'screen':
          navigation.push(b.param);
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      {banners ? (
        <>
          <FlatList
            parentScrollViewRef={parentScrollView}
            data={banners}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            pagingEnabled
            snapToInterval={WINDOW_WIDTH}
            snapToAlignment="start"
          />
          {warning?.show && warning?.message && (
            <View style={styles.warning}>
              <Icon name="alert-octagon" size={24} color="#fff" />
              <Text style={styles.warningText}>{warning.message}</Text>
            </View>
          )}
        </>
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.75,
  },
  placeholder: {
    backgroundColor: '#ccc',
  },
  warning: {
    flex: 1,
    backgroundColor: '#CE3F40',
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    color: '#fff',
    marginLeft: 4,
    flex: 1,
  },
});

export default Banners;
