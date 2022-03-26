import React from 'react';
import {View} from 'react-native';
import RNRestart from 'react-native-restart';
import Empty from '../../organism/empty';

const Maintenance = () => {
  return (
    <View style={{flex: 1}}>
      <Empty
        image="bug_fixed"
        title="Oops! Layanan Belum Tersedia"
        caption="Jangan khawatir, HARNIC.ID akan segera kembali"
        actionLabel="Muat Ulang"
        action={() => RNRestart.Restart()}
      />
    </View>
  );
};

export default Maintenance;
