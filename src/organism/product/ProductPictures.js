import React, {memo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';

const ProductPictures = ({pictures, parentScrollView, video}) => {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;
  const HEADER_MAX_HEIGHT = Dimensions.get('window').width;

  const _renderItems = ({item}) => {
    return (
      <TouchableWithoutFeedback
        style={{
          width: HEADER_MAX_HEIGHT,
          height: HEADER_MAX_HEIGHT,
        }}
        onPress={() => {
          setSelected(item.imagePath);
          setModal(true);
        }}>
        <FastImage
          style={{
            flex: 1,
            width: HEADER_MAX_HEIGHT,
            height: HEADER_MAX_HEIGHT,
          }}
          source={{
            uri: item.imagePath,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableWithoutFeedback>
    );
  };

  const keyExtractor = (item, index) => {
    return String('Img' + index);
  };

  return (
    <>
      <FlatList
        parentScrollView={parentScrollView}
        data={pictures}
        style={{marginVertical: 8}}
        showsHorizontalScrollIndicator={false}
        disableScrollViewPanResponder
        disableIntervalMomentum={true}
        keyExtractor={keyExtractor}
        ListHeaderComponent={() =>
          video ? (
            <View
              style={{
                width: HEADER_MAX_HEIGHT,
                height: HEADER_MAX_HEIGHT,
                backgroundColor: 'red',
              }}>
              <WebView
                style={{flex: 1}}
                javaScriptEnabled={true}
                source={{
                  uri:
                    'https://www.youtube.com/embed/' +
                    video +
                    '?rel=0&autoplay=0&showinfo=0&controls=0',
                }}
              />
            </View>
          ) : null
        }
        snapToInterval={HEADER_MAX_HEIGHT}
        snapToAlignment="center"
        renderItem={_renderItems}
        horizontal
      />
      <Modal
        visible={modal}
        onRequestClose={() => setModal(false)}
        transparent
        statusBarTranslucent
        presentationStyle="fullScreen">
        <TouchableOpacity
          onPress={() => setModal(false)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.3)',
            zIndex: 1,
            position: 'absolute',
            width: 42,
            top: STATUSBAR_HEIGHT + 8,
            left: 8,
            padding: 8,
            aspectRatio: 1 / 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
          }}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <ImageViewer imageUrls={[{url: selected}]} />
      </Modal>
    </>
  );
};

export default memo(ProductPictures);
