import React, {memo} from 'react';
import * as Progress from 'react-native-progress';

const PowerBar = ({width, current, max}) => {
  const done = 1 - current / max;
  return (
    <Progress.Bar
      animated={false}
      progress={done}
      width={width}
      color={done < 1 ? 'orange' : 'gray'}
      unfilledColor="#eee"
    />
  );
};

export default memo(PowerBar);
