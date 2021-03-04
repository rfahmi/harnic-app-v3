import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StatusBar, View, Platform} from 'react-native';
import {IconButton, Title} from 'react-native-paper';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const ScreenTitle = ({title, search}) => {
  const navigation = useNavigation();
  const _handleSearch = () => navigation.push('Search', {key: Date.now()});
  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;

  return (
    <>
      <FocusAwareStatusBar
        translucent={true}
        backgroundColor="rgba(0,0,0,0.3)"
        barStyle="dark-content"
      />
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: STATUSBAR_HEIGHT + 8,
          paddingBottom: 8,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Title>{title}</Title>
        {search && <IconButton icon="magnify" onPress={_handleSearch} />}
      </View>
    </>
  );
};

export default ScreenTitle;
