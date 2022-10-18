import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Image, TouchableOpacity, Linking} from 'react-native';
import {Avatar} from 'react-native-paper';

const HomeIcons = () => {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: 'row'}}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            left: 0,
            zIndex: 1,
            elevation: 5,
          }}>
          <Image
            source={require('../../../assets/images/harnic.png')}
            style={{height: 18, aspectRatio: 5 / 1, alignItems: 'center'}}
            resizeMode="contain"
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          width: '65%',
        }}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() =>
            navigation.push('Search', {
              screen: 'SearchWebView',
              params: {
                title: 'Cek Ongkir',
                url: 'https://page.harnic.id/deliverysupport',
              },
            })
          }>
          <Avatar.Image
            source={require('../../../assets/images/freeongkir.png')}
            style={{
              borderRadius: 0,
              backgroundColor: 'transparent',
              marginLeft: 8,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{flex: 1}}
          onPress={() =>
            // navigation.push('Search', {
            //   screen: 'SearchWebView',
            //   params: {
            //     title: 'Harnic Care',
            //     url: 'https://tawk.to/chat/5d79fce5c22bdd393bb57440/default',
            //   },
            // })
            Linking.openURL('https://wa.me/6282166001212')
          }>
          <Avatar.Image
            source={require('../../../assets/images/cs.png')}
            style={{
              borderRadius: 0,
              backgroundColor: 'transparent',
              marginLeft: 8,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => navigation.navigate('App', {screen: 'Shoplist'})}>
          <Avatar.Image
            source={require('../../../assets/images/shopplist.png')}
            style={{
              borderRadius: 0,
              backgroundColor: 'transparent',
              marginLeft: 8,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeIcons;
