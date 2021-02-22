import React, {memo} from 'react';
import {TouchableOpacity, Image, StyleSheet, StatusBar,Platform} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const BackButton = ({goBack, style}) => (
  <TouchableOpacity onPress={goBack} style={[styles.container, style]}>
    <Image
      style={styles.image}
      source={require('../assets/images/arrow_back.png')}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight,
    padding: 8,
    left: 10,
    zIndex: 1,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(BackButton);
