import {useNavigation, useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import CountDown from 'react-native-countdown-component';
import {TouchableOpacity} from 'react-native-gesture-handler';

const TitleTimer = ({data}) => {
  const [totalDuration, setTotalDuration] = useState(0);

  useFocusEffect(
    useCallback(() => {
      console.log('count timer');
      // Coundown timer for a given expiry date-time
      let date = moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss');

      // Getting the current date-time
      // You can set your own date-time
      let expirydate = data.param2;

      let diffr = moment.duration(moment(expirydate).diff(moment(date)));
      // Difference of the expiry date-time
      var hours = Number(diffr.asHours());
      var minutes = Number(diffr.minutes());
      var seconds = Number(diffr.seconds());

      // Converting in seconds
      var d = hours * 60 * 60 + minutes * 60 + seconds;

      // Settign up the duration of countdown
      setTotalDuration(d);
    }, []),
  );

  const navigation = useNavigation();
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: data.color2,
      }}>
      <View>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: data.color1}}>
          {data.param1}
        </Text>
        {data.param3 && (
          <TouchableOpacity
            onPress={() => navigation.push('HomePage', {name: data.param3})}>
            <Text style={{fontSize: 12, color: data.color1}}>Lihat Semua</Text>
          </TouchableOpacity>
        )}
      </View>

      {totalDuration > 0 && (
        <CountDown
          until={totalDuration}
          timetoShow={('H', 'M', 'S')}
          digitStyle={{backgroundColor: data.color1}}
          digitTxtStyle={{color: data.color2}}
          timeLabelStyle={{color: data.color1, fontWeight: 'bold'}}
          size={14}
        />
      )}
    </View>
  );
};

export default memo(TitleTimer);
