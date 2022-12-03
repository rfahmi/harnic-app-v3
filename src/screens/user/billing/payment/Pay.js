import React, {memo} from 'react';
import {Text, View} from 'react-native';
import HeaderBack from '../../../../components/HeaderBack';
import PaymentDW from './PaymentDW';
import PaymentVA from './PaymentVA';
const Pay = ({navigation, route}) => {
  const {code, trx} = route.params;
  return (
    <>
      {code === 'va' ? (
        <PaymentVA trx={trx} />
      ) : code === 'dw' ? (
        <PaymentDW trx={trx} />
      ) : (
        <>
          <HeaderBack title="Not Supported" search={false} />
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Not Supported Yet</Text>
          </View>
        </>
      )}
    </>
  );
};

export default memo(Pay);
