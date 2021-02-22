import React, {memo} from 'react';
import {Text, View} from 'react-native';

const CreditCard = ({num, holder, exp}) => {
  const num_formated = num.match(/.{1,4}/g).join(' ');
  const exp_formated = exp.match(/.{1,2}/g).join('/');
  return (
    <View
      style={[
        {
          position: 'relative',
          flex: 1,
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#fff',
          aspectRatio: 2 / 1,
          marginBottom: 8,
          marginHorizontal: 16,
          elevation: 4,
        },
      ]}>
      <View
        style={{
          position: 'absolute',
          bottom: 110,
          left: 16,
          borderRadius: 4,
          width: 50,
          aspectRatio: 3 / 2,
          backgroundColor: '#eee',
        }}
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          position: 'absolute',
          bottom: 60,
          left: 16,
        }}>
        {num_formated}
      </Text>
      <Text style={{fontSize: 16, position: 'absolute', bottom: 24, left: 16}}>
        {holder}
      </Text>
      <View
        style={{
          position: 'absolute',
          bottom: 32,
          right: 24,
          fontSize: 22,
          fontWeight: 'bold',
          color: '#999',
        }}>
        <Text style={{color: '#999', fontSize: 8}}>Valid Thru</Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#999',
          }}>
          {exp_formated}
        </Text>
      </View>
    </View>
  );
};

export default memo(CreditCard);
