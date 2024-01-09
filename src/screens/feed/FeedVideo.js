import React, {useNavigation} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import ProductCardFeed from '../../components/ProductCardFeed';
import InViewPort from '@coffeebeanslabs/react-native-inviewport';

const FeedVideo = ({item, pauseAll, containerHeight}) => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth);
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isManualPaused, setIsManualPaused] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnInViewPort = visible => {
    setIsPaused(!visible || pauseAll);
  };

  useEffect(() => {
    videoRef.current?.seek(0);
  }, [pauseAll]);

  useEffect(() => {
    setIsManualPaused(isPaused);
  }, [isPaused]);

  const handleTogglePause = () => {
    setIsManualPaused(!isManualPaused);
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
      <InViewPort onChange={isVisible => handleOnInViewPort(isVisible)}>
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
          paused={isPaused || isManualPaused}
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
      </InViewPort>
    </TouchableOpacity>
  );
};

export default FeedVideo;
