import React, {useNavigation} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import ProductCardFeed from '../../components/ProductCardFeed';

const FeedVideo = ({item, idPlayed, pauseAll, containerHeight}) => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth);
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(idPlayed !== item.uniqueId);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    videoRef.current?.seek(0);
    setIsPaused(idPlayed !== item.uniqueId);
  }, [idPlayed, item, pauseAll]);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleBuffer = ({isBuffering}) => {
    setIsLoading(isBuffering);
  };

  const handleError = error => {
    console.error('Video Error:', error);
    setIsLoading(false);
  };
  
  return (
    <TouchableOpacity
      onPress={() => {
        handleTogglePause();
      }}
      activeOpacity={1}
      style={{
        width: Dimensions.get('window').width,
        height: containerHeight,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Video
        ref={videoRef}
        source={{uri: item.feed_video}}
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: containerHeight,
        }}
        resizeMode="cover"
        repeat
        paused={isPaused || pauseAll}
        onBuffer={handleBuffer}
        onError={handleError}
      />

      {isLoading && (
        <ActivityIndicator
          style={{position: 'absolute', top: '45%', left: '45%'}}
          size="large"
          color="#fff"
        />
      )}
      <ProductCardFeed
        item={item}
        auth={auth}
        onPress={() =>
          navigation.push('Search', {
            screen: 'Product',
            params: {itemid: item.itemid},
          })
        }
      />
    </TouchableOpacity>
  );
};

export default FeedVideo;
