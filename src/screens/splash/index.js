import React, {useEffect} from 'react';
import {Image, StatusBar, Text, View} from 'react-native';
import Logo from '../../components/Logo';
import {colors} from '../../constants/colors';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => navigation.replace('App'), 600);
  }, [navigation]);

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Logo />
        <View
          style={{
            flexDirection: 'row',
            height: 80,
          }}>
          <Image
            style={{
              flex: 1,
              resizeMode: 'center',
            }}
            source={require('../../assets/images/freeongkir.png')}
          />
          <Image
            style={{
              flex: 1,
              resizeMode: 'center',
            }}
            source={require('../../assets/images/cod.png')}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <Text style={{color: colors.gray, fontSize: 12}}>Versi 3.0.0</Text>
          <Text style={{color: colors.gray, fontSize: 12}}>
            {'\u00A9'} PT. Harnic Online Store
          </Text>
        </View>
      </View>
    </>
  );
};

export default Splash;
