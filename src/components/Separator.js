import React from 'react';
import {View} from 'react-native';

const Separator = ({color}) => {
  return <View style={{height: 8, backgroundColor: color || '#eee'}} />;
};

export default Separator;
