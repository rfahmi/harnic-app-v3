import CameraRoll from '@react-native-camera-roll/camera-roll';
import moment from 'moment/moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import {IconButton} from 'react-native-paper';
import {captureRef} from 'react-native-view-shot';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import {
  getTrxData,
  resetTrxList,
  voidTrx,
} from '../../configs/redux/slice/cashierSlice';
import {currencyFormat} from '../../utils/formatter';

const Table = ({data}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.header1}>Qty</Text>
        <Text style={styles.header3}>Produk</Text>
        <Text style={styles.header2}>Harga</Text>
      </View>
      <FlatList
        data={data.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Text style={styles.cell1}>{item.qty}</Text>
            <Text style={styles.cell3}>{item.online_name}</Text>
            <Text style={styles.cell2}>
              {currencyFormat(Number(item.price) * Number(item.qty))}
            </Text>
          </View>
        )}
      />
      <View style={styles.total}>
        <Text style={styles.totalText}>Harga Total</Text>
        <Text style={styles.totalValue}>{currencyFormat(data.total)}</Text>
      </View>
    </View>
  );
};

const CashierReceipt = ({navigation}) => {
  const dispatch = useDispatch();
  const viewRef = useRef();
  const {trx, loading, error} = useSelector(state => state.cashier);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [statusTrx, setStatusTrx] = useState('');

  useEffect(() => {
    const timeStr = trx?.orderdate; //"2023-10-06 20:46:09"
    if (timeStr) {
      const parsedDate = moment(timeStr, 'YYYY-MM-DD HH:mm:ss'); // Parse the timeStr
      const day = parsedDate.format('dddd');
      const date = parsedDate.format('LL');
      const time = parsedDate.format('HH:mm');
      setCurrentDateTime(`${day}, ${date}, ${time}`);
      switch (trx.status_desc) {
        case 'SEDANG DIKIRIM':
          setStatusTrx('BELUM DIBAYAR');
          break;
        case 'TERKIRIM':
          setStatusTrx('SUDAH DIBAYAR');
          break;
        case 'BATAL':
          setStatusTrx('VOID');
          break;
        default:
          break;
      }
    }
  }, [trx]);

  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  }

  const captureScreen = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'jpg',
        quality: 0.8,
      });

      const dir = RNFS.DownloadDirectoryPath;
      const fileName = trx.trxno_wl + '.jpg';
      const imagePath = `${dir}/${fileName}`;

      await RNFS.copyFile(uri, imagePath);

      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }
      Alert.alert('Receipt Saved', imagePath);
      CameraRoll.save(imagePath, {type: 'photo'});
    } catch (e) {
      console.log('Error capturing screen:', e);
    }
  };

  return (
    <>
      {!loading && trx && (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.title}>Waling Receipt</Text>
            <Text>{currentDateTime}</Text>
          </View>
          <ScrollView style={{flex: 1}}>
            <View
              ref={viewRef}
              style={{backgroundColor: '#fff', justifyContent: 'center'}}>
              <View style={{alignItems: 'center'}}>
                <Text>{`Nomor Transaksi: ${trx.trxno_wl} [${statusTrx}]`}</Text>
              </View>
              <Table data={trx} />
            </View>
          </ScrollView>
          <View
            style={{
              paddingVertical: 4,
              paddingHorizontal: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 16,
              alignItems: 'center',
            }}>
            <IconButton
              style={{flex: 1}}
              icon="content-save"
              onPress={captureScreen}
            />
            {trx.status_code == 4 && (
              <IconButton
                style={{flex: 1}}
                color="red"
                icon="close-circle"
                onPress={() => {
                  dispatch(voidTrx({trxno: trx.trxno}));
                  dispatch(getTrxData({trxno: trx.trxno}));
                }}
              />
            )}
            {trx.status_code == 4 && (
              <Button
                style={{flex: 4}}
                icon="chevron-right-circle"
                mode="contained"
                onPress={() =>
                  navigation.push('CashierPayment', {trxno: trx.trxno})
                }>
                Pembayaran
              </Button>
            )}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
  },
  header1: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
  },
  header2: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
  },
  header3: {
    fontWeight: 'bold',
    flex: 5,
    textAlign: 'left',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cell1: {
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
  },
  cell2: {
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
  },
  cell3: {
    flex: 5,
    textAlign: 'left',
    fontSize: 12,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
    paddingTop: 5,
  },
  totalText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  totalValue: {
    flex: 1,
    textAlign: 'center',
  },
});

export default CashierReceipt;
