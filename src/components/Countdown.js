import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const Countdown = ({ until, onFinish, digitStyle, digitTxtStyle, separatorStyle }) => {
  const [seconds, setSeconds] = useState(until);

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      onFinish && onFinish();
    }
  }, [seconds]);

  const formatTime = time => (time < 10 ? `0${time}` : time);

  const getHours = () => Math.floor(seconds / 3600);
  const getMinutes = () => Math.floor((seconds % 3600) / 60);
  const getSeconds = () => Math.floor(seconds % 60);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{alignItems:'center'}}>
        <View style={[{ backgroundColor: '#333', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4 }, digitStyle]}>
            <Text style={[{ fontSize: 12, color: '#fff', fontWeight: 'bold' }, digitTxtStyle]}>
            {formatTime(getHours())}
            </Text>
        </View>
        <Text style={{color:'#fff', fontSize:9, marginTop: 4}}>Jam</Text>
      </View>
      <Text style={[{ fontSize: 12, color: '#fff', marginLeft: 5, marginRight: 5, fontWeight: 'bold' }, separatorStyle]}>
        :
      </Text>
      <View style={{alignItems:'center'}}>
      <View style={[{ backgroundColor: '#333', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4 }, digitStyle]}>
        <Text style={[{ fontSize: 12, color: '#fff', fontWeight: 'bold' }, digitTxtStyle]}>
          {formatTime(getMinutes())}
        </Text>
      </View>
      <Text style={{color:'#fff', fontSize:9, marginTop: 4}}>Menit</Text>
      </View>
      <Text style={[{ fontSize: 12, color: '#fff', marginLeft: 5, marginRight: 5, fontWeight: 'bold' }, separatorStyle]}>
        :
      </Text>
      <View style={{alignItems:'center'}}>
      <View style={[{ backgroundColor: '#333', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4 }, digitStyle]}>
        <Text style={[{ fontSize: 12, color: '#fff', fontWeight: 'bold' }, digitTxtStyle]}>
          {formatTime(getSeconds())}
        </Text>
      </View>
      <Text style={{color:'#fff', fontSize:9, marginTop: 4}}>Detik</Text>
      </View>
    </View>
  );
};

export default Countdown;
