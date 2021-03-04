import React, {memo} from 'react';
import {ImageBackground, KeyboardAvoidingView, StyleSheet} from 'react-native';

const Background = ({children}) => (
  <ImageBackground
    source={require('../assets/images/background_dot.png')}
    resizeMode="repeat"
    style={styles.background}>
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      {children}
    </KeyboardAvoidingView>
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
