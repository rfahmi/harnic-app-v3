import React, {memo} from 'react';
import {View} from 'react-native';
import * as Progress from 'react-native-progress';

const PowerBar = ({width, current, max}) => {
  const done = 1 - current / max;
  if (done < 0) {
    // console.log('DONE IS INVALID');
    return <View />;
  } else {
    return (
      <Progress.Bar
        animated={false}
        progress={100}
        width={width}
        color={done < 1 ? 'orange' : 'gray'}
        unfilledColor="#eee"
      />
    );
  }
};

export default memo(PowerBar);
