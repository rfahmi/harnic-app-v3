import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {List, TextInput} from 'react-native-paper';
import HeaderBack from '../../components/HeaderBack';
import AsyncStorage from '@react-native-community/async-storage';

const Developer = ({navigation}) => {
  const [fcm, setFcm] = useState(null);
  useEffect(() => {
    const getFcm = async () => {
      setFcm(await AsyncStorage.getItem('fcm_token'));
    };
    getFcm();
  }, []);
  return (
    <View>
      <HeaderBack search={false} title="Developer" />
      <List.Item
        title="Goto Test Panel"
        onPress={() =>
          navigation.navigate('HomePanel', {
            name: 2,
          })
        }
      />
      <List.Item
        title="Goto Test Page"
        onPress={() =>
          navigation.navigate('HomePage', {
            name: 'test',
          })
        }
      />
      <TextInput value={fcm} mode="outlined" selectTextOnFocus />
    </View>
  );
};

export default Developer;
