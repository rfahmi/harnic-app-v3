import React, {memo} from 'react';
import {View, Text} from 'react-native';
import HeaderBack from '../../../../components/HeaderBack';
import PaymentCOD from './PaymentCOD';
import PaymentTF from './PaymentTF';
import PaymentVA from './PaymentVA';
import PaymentCC from './PaymentCC';
import PaymentDW from './PaymentDW';
const Pay = ({navigation, route}) => {
  const {code, trx} = route.params;
  return (
    <>
      {code === 'tf' ? (
        <PaymentTF trx={trx} />
      ) : code === 'cod' ? (
        <PaymentCOD trx={trx} />
      ) : code === 'va' ? (
        <PaymentVA trx={trx} />
      ) : code === 'cc' ? (
        <PaymentCC trx={trx} />
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
