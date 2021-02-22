import React, {memo, useState} from 'react';
import {
  Dimensions,
  Modal,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-smart-carousel';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const ProductPictures = ({pictures, parentScrollView}) => {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;
  const picture = (id) => {
    const idx = pictures.findIndex((x) => x.id === id);
    return pictures[idx];
  };
  const HEADER_MAX_HEIGHT = Dimensions.get('window').width;
  return (
    <>
      <Carousel
        parentScrollViewRef={parentScrollView}
        data={pictures}
        autoPlay={false}
        height={HEADER_MAX_HEIGHT}
        navigation={true}
        navigationColor={'#ffffff'}
        navigationType={'dot'}
        onPress={(e) => {
          const b = picture(e);
          setSelected(b.imagePath);
          setModal(true);
        }}
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
