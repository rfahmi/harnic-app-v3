import Clipboard from '@react-native-community/clipboard';
import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Caption, Title} from 'react-native-paper';
import HarnicToast from '@components/HarnicToast';
import {colors} from '../constants/colors';
import Dash from 'react-native-dash';

const VoucherCard = ({data}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        Clipboard.setString(data.vc_code);
        HarnicToast.Show({
          title: data.vc_code + ' Disalin ke papan klip',
          position: 'center',
        });
      }}
      style={{
        position: 'relative',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 22,
        backgroundColor: colors.primaryLight,
        marginHorizontal: 16,
        elevation: 4,
      }}>
      <View
        style={{
          backgroundColor: '#fcfcfc',
          height: 20,
          width: 20,
          position: 'absolute',
          borderRadius: 20,
          top: '55%',
          left: -10,
        }}
      />
      <View
        style={{
          backgroundColor: '#fcfcfc',
          height: 20,
          width: 20,
          position: 'absolute',
          borderRadius: 20,
          top: '55%',
          right: -10,
        }}
      />
      <View
        style={{
          backgroundColor: colors.white,
          position: 'absolute',
          bottom: 16,
          right: 16,
          borderRadius: 4,
          paddingVertical: 4,
          paddingHorizontal: 8,
          zIndex: 9,
        }}>
        <Text
          style={{color: colors.grayDark, fontSize: 11, fontWeight: 'bold'}}>
          Salin Kode
        </Text>
      </View>
      <View style={{height: 54, justifyContent: 'center'}}>
        <Title style={{color: colors.white}}>
          {data.vc_code.toUpperCase()}
        </Title>
      </View>
      <Dash
        style={{flex: 1, height: 1}}
        dashLength={6}
        dashGap={4}
        dashThickness={1}
        dashColor="white"
        dashStyle={{borderRadius: 100, overflow: 'hidden'}}
      />
      <View style={{paddingVertical: 4}}>
        <Caption style={{color: colors.white}}>{data.vc_name}</Caption>
        <Caption style={{color: colors.white}}>
          Kadaluwarsa: {data.vc_enddate}
        </Caption>
      </View>
    </TouchableOpacity>
  );
};

export default memo(VoucherCard);
