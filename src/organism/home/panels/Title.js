import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../constants/colors';

const Title = ({data}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: data.color2,
      }}>
      <Text style={{fontSize: 16, fontWeight: 'bold', color: data.color1, maxWidth: '65%'}}>
        {data.param1}
      </Text>
      {data.param2 && (
        <Button
          onPress={() =>
            navigation.push(data.param2 === 'page' ? 'HomePage' : 'HomePanel', {
              name: data.param3,
            })
          }
          mode="contained"
          color={data.color1}
          labelStyle={{fontSize: 11}}
          contentStyle={{
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          uppercase={false}>
          <Text>Lihat Semua</Text>
          <Icon name="arrow-right" size={12} />
        </Button>
      )}
    </View>
  );
};

export default memo(Title);
