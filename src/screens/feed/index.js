import React, {useRef, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Video from 'react-native-video';

const FeedItem = ({item, idPlayed}) => {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(idPlayed !== item.id);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
        <Video
          ref={videoRef}
          source={{uri: item.youtube_url}}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={isPaused}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 78,
  },
  video: {
    flex: 1,
  },
});

const Feed = () => {
  const data = [
    {
      id: 1,
      youtube_url:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    },
    {
      id: 2,
      youtube_url:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
  ];
  const [idPlayed, setIdPlayed] = useState(data[0].id);
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    console.log('changed page', viewableItems);
    const visibleItem = viewableItems.find(a => a.isViewable) || null;
    if (visibleItem && visibleItem.item > 0) {
      setIdPlayed(visibleItem.item.id);
    } else {
      setIdPlayed(0);
    }
  });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
  });

  return (
    <>
      <FlatList
        data={data}
        renderItem={({item}) => <FeedItem idPlayed={idPlayed} item={item} />}
        keyExtractor={item => `video${item.id}`}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        pagingEnabled
      />
    </>
  );
};

export default Feed;
