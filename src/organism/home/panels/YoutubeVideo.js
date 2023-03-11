import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import YouTube from 'react-native-youtube';

const getYoutubeId = (url) => {
  const regex = /[\?&]v=([^&#]*)/;
  const youtubeId = regex.exec(url)[1];
  return youtubeId;
};

const YoutubeVideo = ({data}) => {
  const videoId = getYoutubeId(data.api);

  return (
    <View style={styles.container}>
      <YouTube
        apiKey="AIzaSyBX3NxU1_YZq0I6f6B3hrZfeKpnC6opb68"
        videoId={videoId}
        style={styles.video}
        play={false}
        loop={false}
        controls={1}
        modestbranding={true}
        resumePlayAndroid={false}
        aspectRatio={16 / 9}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: Dimensions.get('screen').width,
    alignSelf: 'stretch',
  },
});

export default YoutubeVideo;
