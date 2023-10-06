import {useIsFocused} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useDispatch, useSelector} from 'react-redux';
import {uploadPaymentPhoto} from '../../configs/redux/slice/cashierSlice';
import { colors } from '../../constants/colors';

const CashierPayment = ({navigation, route}) => {
  const {trxno} = route.params;
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();
  const [processingBarcode, setProcessingBarcode] = useState(false);
  const [uploading, setUploading] = useState(false); // Loading state for upload
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.cashier);

  const handleCapture = async () => {
    try {
      if (uploading) {
        // If uploading is in progress, return early to prevent double-processing
        return;
      }

      if (cameraRef.current) {
        const options = {quality: 0.5, base64: true};
        const data = await cameraRef.current.takePictureAsync(options);

        const formData = new FormData();
        formData.append('photo', {
          uri: data.uri,
          type: 'image/jpeg', // Adjust the MIME type as needed
          name: 'photo.jpg', // Adjust the file name as needed
        });

        // Start uploading and set uploading to true
        setUploading(true);

        // Dispatch the uploadPaymentPhoto action with the formData
        await dispatch(uploadPaymentPhoto({trxno, formData}));
        navigation.replace('Cashier');
      }
    } catch (e) {
      console.error('Error Payment Capture', e);
    } finally {
      // After upload (success or error), set uploading back to false
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && !processingBarcode && (
        <RNCamera ref={cameraRef} style={styles.camera} captureAudio={false}>
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity
              style={[
                styles.captureButton,
                uploading && styles.disabledCaptureButton,
              ]}
              onPress={handleCapture}
              disabled={uploading} // Disable the button when uploading
            >
              {uploading ? (
                <ActivityIndicator color={colors.primary} /> // Display loading indicator while uploading
              ) : (
                <></>
              )}
            </TouchableOpacity>
          </View>
        </RNCamera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20, // Adjust the margin as needed
  },
  captureButton: {
    backgroundColor: 'white', // Adjust the button's background color
    borderRadius: 50, // Makes it a circular button
    borderColor: '#ddd',
    borderWidth: 12,
    width: 60, // Adjust the button's size
    height: 60, // Adjust the button's size
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledCaptureButton: {
    backgroundColor: '#ccc', // Adjust the disabled button's background color
  },
});

export default CashierPayment;
