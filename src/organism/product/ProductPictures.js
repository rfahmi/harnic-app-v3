import React, {memo, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import {getStatusBarHeight} from 'react-native-safearea-height';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';

const ProductPictures = ({pictures, parentScrollView, video}) => {
  const [modal, setModal] = useState(false);
  const [picArr, setPicArr] = useState([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const arr = pictures.map(a => ({url: a.imagePath}));
    setPicArr(arr);
  }, [pictures]);

  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;
  const HEADER_MAX_HEIGHT = Dimensions.get('window').width;

  const _renderItem = ({item, index}) => (
    <TouchableWithoutFeedback
      style={{
        width: HEADER_MAX_HEIGHT,
        height: HEADER_MAX_HEIGHT,
      }}
      onPress={() => {
        setSelected(index);
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

  const keyExtractor = (item, index) => `Img${index}`;

  const ListHeader = React.useMemo(
    () =>
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
              uri: `https://www.youtube.com/embed/${video}?rel=0&autoplay=0&showinfo=0&controls=0`,
            }}
          />
        </View>
      ) : null,
    [video, HEADER_MAX_HEIGHT],
  );

  return (
    <>
      <FlatList
        parentScrollView={parentScrollView}
        data={pictures}
        showsHorizontalScrollIndicator={false}
        disableScrollViewPanResponder
        disableIntervalMomentum={true}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        renderItem={_renderItem}
        horizontal
        snapToInterval={HEADER_MAX_HEIGHT}
        snapToAlignment="center"
      />
      <Modal
        visible={modal}
        onRequestClose={() => setModal(false)}
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
        <ImageViewer imageUrls={picArr} index={selected} />
      </Modal>
    </>
  );
};

export default memo(ProductPictures);
