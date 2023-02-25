import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import {RNCamera} from 'react-native-camera';
import {RNToasty} from 'react-native-toasty';
import {api} from '../../configs/api';

const Scan = ({navigation}) => {
  const isFocused = useIsFocused();
  const [processingBarcode, setProcessingBarcode] = useState(false);

  const getPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
  }

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
    console.log("Effect");
    getPermission();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.root}>
      <View style={styles.upperSection}>
        <RNCamera
          onBarCodeRead={isFocused ? onBarCodeRead : null}
          style={styles.preview}>
          <BarcodeMask
            width={300}
            height={300}
            showAnimatedLine={true}
            outerMaskOpacity={0.8}
          />
        </RNCamera>
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
