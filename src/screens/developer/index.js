import React from 'react';
import {View} from 'react-native';
import {List} from 'react-native-paper';
import HeaderBack from '../../components/HeaderBack';

const Developer = ({navigation}) => {
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
    </View>
  );
};

export default Developer;
