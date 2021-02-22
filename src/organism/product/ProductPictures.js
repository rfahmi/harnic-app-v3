import React, {memo, useState} from 'react';
import {Dimensions, Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Carousel from 'react-native-smart-carousel';

const ProductPictures = ({pictures, parentScrollView}) => {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
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
        <ImageViewer imageUrls={[{url: selected}]} />
      </Modal>
    </>
  );
};

export default memo(ProductPictures);
