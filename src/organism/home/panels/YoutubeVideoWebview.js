import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';

const getYoutubeId = (url) => {
  const regex = /[\?&]v=([^&#]*)/;
  const youtubeId = regex.exec(url)[1];
  return youtubeId;
};

const YoutubeVideo = ({data}) => {
  const videoId = getYoutubeId(data.api);

  return (
    <View style={styles.container}>
      <WebView
        style={styles.video}
        javaScriptEnabled={true}
        source={{
          uri:
            'https://www.youtube.com/embed/' +
            videoId +
            '?rel=0&autoplay=0&showinfo=0&controls=0',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 300,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: Dimensions.get('screen').width,
    alignSelf: 'stretch',
  },
});

export default YoutubeVideo;
