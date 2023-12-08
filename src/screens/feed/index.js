import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Video from 'react-native-video';

const FeedItem = ({item, idPlayed, pauseAll}) => {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(idPlayed !== item.id);
  useEffect(() => {
    videoRef.current?.seek(0);
    setIsPaused(idPlayed !== item.id);
    console.log('is paused?', idPlayed !== item.id, idPlayed);
  }, [idPlayed, item, pauseAll]);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <TouchableOpacity
      onPress={handleTogglePause}
      activeOpacity={1}
      style={styles.container}>
      <Video
        ref={videoRef}
        source={{uri: item.youtube_url}}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={isPaused || pauseAll}
      />

      <View
        style={{
          backgroundColor: '#fff',
          height: 80,
          width: 300,
          borderRadius: 8,
          overflow: 'hidden',
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 20,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: 80,
              height: 80,
            }}>
            <FastImage
              style={{
                flex: 1,
              }}
              source={{
                uri: 'https://fiorellaindia.com/wp-content/uploads/2021/05/Santorini-Box-min-scaled.jpg',
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View style={{flex: 1, padding: 8, gap: 6}}>
            <Text>Nama Produk Akan Ada Disini Nama Produk Akan Ada Disini</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'orange',
                marginBottom: 2,
              }}>
              Rp. 200,000
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 54,
  },
  video: {
    flex: 1,
  },
});

const Feed = () => {
  const isFocus = useIsFocused();
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [pauseAll, setPauseAll] = useState(false);

  const DATA_DUMMY = [
    {
      id: 1,
      youtube_url:
        'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    },
    {
      id: 2,
      youtube_url:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    },
    {
      id: 3,
      youtube_url:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      id: 4,
      youtube_url:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
  ];

  const fetchData = p => {
    console.log('current page', p);
    setPage(p);
    if (p === 1) {
      setData(DATA_DUMMY);
    } else {
      setTimeout(() => {
        setData(prevData => [...prevData, ...DATA_DUMMY]);
      }, 1000);
    }
  };

  const [idPlayed, setIdPlayed] = useState(0);
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    console.log('vis 1', viewableItems);
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems.find(a => a.isViewable);
      console.log('vis 2', visibleItem.item.id);
      if (visibleItem.item) {
        setIdPlayed(visibleItem.item.id);
      } else {
        setIdPlayed(0);
      }
    }
  });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  });

  useEffect(() => {
    setPauseAll(!isFocus);
  }, [isFocus]);

  useEffect(() => {
    console.log('data now has ', data.length);
  }, [data]);

  useEffect(() => {
    fetchData(1);
  }, []);

  return (
    <>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="rgba(0,0,0,0.1)"
      />
      <FlatList
        data={data}
        renderItem={({item}) => (
          <FeedItem idPlayed={idPlayed} item={item} pauseAll={pauseAll} />
        )}
        keyExtractor={item => `video${item.id}`}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        pagingEnabled
        // onEndReached={() => fetchData(page + 1)}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};

export default Feed;
