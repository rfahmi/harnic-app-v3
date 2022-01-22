import React from 'react';
import {BackHandler, View} from 'react-native';
import Empty from '../../organism/empty';

const Maintenance = () => {
  return (
    <View style={{flex: 1}}>
      <Empty
        image="bug_fixed"
        title="Oops! Layanan Belum Tersedia"
        caption="Jangan khawatir, HARNIC.ID akan segera kembali"
        actionLabel="KEMBALI NANTI"
        action={() => BackHandler.exitApp()}
      />
    </View>
  );
};

export default Maintenance;
