import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Appbar} from 'react-native-paper';

const HeaderBack = ({title, subtitle, styles, search = true, back}) => {
  const navigation = useNavigation();
  const _goBack = () => (back ? back() : navigation.goBack());

  const _handleSearch = () => navigation.push('Search', {key: Date.now()});

  return (
    <Appbar.Header style={[{backgroundColor: '#fff', elevation: 0}, styles]}>
      <Appbar.Action icon="arrow-left" onPress={_goBack} />
      <Appbar.Content title={title} subtitle={subtitle} />
      {search && <Appbar.Action icon="magnify" onPress={_handleSearch} />}
    </Appbar.Header>
  );
};

export default HeaderBack;
