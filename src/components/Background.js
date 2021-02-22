import React, {memo} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';

const Background = ({children}) => (
  <ImageBackground
    source={require('../assets/images/background_dot.png')}
    resizeMode="repeat"
    style={styles.background}>
    <View style={styles.container} behavior="padding">
      {children}
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(Background);
