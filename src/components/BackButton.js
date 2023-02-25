import React, {memo} from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BackButton = ({goBack, style}) => (
  <TouchableOpacity onPress={goBack} style={[styles.container, style]}>
    <Icon name="arrow-left" size={24} />
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
});

export default memo(BackButton);
