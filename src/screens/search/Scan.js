import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {RNCamera, Camera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {RNToasty} from 'react-native-toasty';
import {api} from '../../configs/api';
import {useIsFocused} from '@react-navigation/native';

const Scan = ({navigation}) => {
  const isFocused = useIsFocused();
  const [processingBarcode, setProcessingBarcode] = useState(false);

  const getPermission = async () => {
    const {status} = await Camera.requestCameraPermissions();
    if (status !== 'granted') {
      RNToasty.Warn({
        title: 'Izin kamera dibutuhkan untuk menggunakan fitur ini.',
        position: 'center',
      });
    }
  };

  const onBarCodeRead = async (scanResult) => {
    if (!processingBarcode) {
      setProcessingBarcode(true);
      await api.get('/product/barcode/' + scanResult.data).then((res) => {
        if (res.data.success) {
          navigation.push('Product', {itemid: res.data.data.itemmst});
        } else {
          navigation.goBack();
          RNToasty.Warn({
            title: 'Produk tidak ditemukan',
            position: 'center',
          });
        }
        setProcessingBarcode(false);
      });
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.root}>
      <View style={styles.upperSection}>
        {isFocused && (
          <RNCamera
            onBarCodeRead={onBarCodeRead}
            style={styles.preview}
            captureAudio={false}>
            <BarcodeMask
              width={300}
              height={300}
              showAnimatedLine={true}
              outerMaskOpacity={0.8}
            />
          </RNCamera>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = {
  root: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  upperSection: {
    flex: 1,
  },
  camera: {
    height: '100%',
  },
};

export default Scan;
