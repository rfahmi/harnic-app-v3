import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';
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
      }}>
      <Text style={{fontSize: 16, fontWeight: 'bold', color: data.color1}}>
        {data.param1}
      </Text>
      {data.param2 && (
        <Button
          onPress={() => navigation.push('HomePage', {name: data.param3})}
          mode="contained"
          color={colors.primary}
          labelStyle={{fontSize: 11, margin: 0, textAlign: 'left'}}
          contentStyle={{
            height: 16,
            justifyContent: 'flex-end',
          }}
          uppercase={false}>
          Lihat Semua
        </Button>
      )}
    </View>
  );
};

export default memo(Title);
