import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {
  Dimensions,
  Animated,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar';
import {colors} from '../../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeTopBar = ({headerOpacity, visibility, auth}) => {
  const navigation = useNavigation();
  const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;

  const HeaderContent = ({mode}) => {
    return (
      <>
        <FocusAwareStatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <View
          style={{
            width: Dimensions.get('window').width,
            height: STATUSBAR_HEIGHT,
            position: 'absolute',
            backgroundColor: mode === 'light' ? 'transparent' : '#aaa',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: mode === 'light' ? '#fff' : colors.grayLight,
            borderRadius: 8,
            padding: 8,
            flex: 1,
            opacity: 1,
          }}
          onPress={() => navigation.navigate('Search')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon color="#999" size={14} name="magnify" />
            <Text style={{fontSize: 14, color: '#999', marginLeft: 5}}>
              Cari produk
            </Text>
          </View>
        </TouchableOpacity>
        <IconButton
          icon="barcode-scan"
          color={mode === 'light' ? colors.white : colors.grayDark}
          size={26}
          style={{zIndex: 1}}
          onPress={() => {
            navigation.push('Search', {
              screen: 'Scan',
              params: {action: 'sase'},
            });
          }}
        />
        <IconButton
          icon="bell"
          color={mode === 'light' ? colors.white : colors.grayDark}
          size={26}
          style={{zIndex: 1}}
          onPress={async () => {
            const user_data = JSON.parse(
              await AsyncStorage.getItem('user_data'),
            );
            auth.isLogin
              ? navigation.navigate('User', {
                  screen: 'UserNotification',
                  params: {user_id: user_data.user_id},
                })
              : navigation.push('Auth');
          }}
        />
      </>
    );
  };
  return (
    <>
      <Animated.View
        style={{
          paddingTop: STATUSBAR_HEIGHT,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 8,
          zIndex: 1,
          flex: 1,
          alignItems: 'center',
          opacity: headerOpacity,
          flexDirection: 'row',
        }}>
        <HeaderContent mode="light" />
      </Animated.View>
      <Animated.View
        style={{
          paddingTop: STATUSBAR_HEIGHT,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 8,
          zIndex: 1,
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#fff',
          opacity: visibility,
          flexDirection: 'row',
        }}>
        <HeaderContent mode="dark" />
      </Animated.View>
    </>
  );
};

export default memo(HomeTopBar);
