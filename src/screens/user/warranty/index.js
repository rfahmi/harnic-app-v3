import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {api} from '../../../configs/api';
import QueryString from 'qs';
import HeaderBack from '../../../components/HeaderBack';
import {Button, Divider, List, TextInput, Title} from 'react-native-paper';
import {colors} from '../../../constants/colors';
import {Modalize} from 'react-native-modalize';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as assets from '../../../assets/images';

const Warranty = ({route}) => {
  const WINDOW_WIDTH = Dimensions.get('window').width;
  const modalizeRef = useRef(null);
  const modalizeResult = useRef(null);
  const {user_id} = route.params;
  const [progress, setProgress] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [kodeGaransi, setKodeGaransi] = useState('');
  const [dataGaransi, setDataGaransi] = useState(null);
  const [shippings, setShippings] = useState([]);
  const [shippingSelected, setShippingSelected] = useState(null);

  useEffect(() => {
    setProgress(true);
    getShippings()
      .then(() => setProgress(false))
      .catch(() => setProgress(false));
  }, []);

  const addGaransi = async code => {
    setProgress(true);
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .post(
        `/user/${user_id}/warranty/${code}/claim`,
        QueryString.stringify({
          name: name,
          addr: `${shippingSelected.shipping_address},${shippingSelected.subdis_name},${shippingSelected.city_name},${shippingSelected.prov_name},${shippingSelected.zip_code}`,
        }),
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      )
      .then(res => {
        setProgress(false);
        if (res.data.status) {
          setDataGaransi(res.data);
        } else {
          setError(res.data.message);
        }
        modalizeResult.current?.open();
      })
      .catch(err => {
        console.log(err.message());
      });
  };

  const getShippings = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .get(`/user/${user_id}/shipping`, {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        setShippings(res.data.data);
        setShippingSelected(res.data.data[0]);
      })
      .catch(err => {
        console.log('error get shipping', err.message());
        setShippings([]);
      });
  };

  const handleClaimPress = () => {
    addGaransi(kodeGaransi);
  };

  const openModal = () => {
    modalizeRef.current?.open();
  };
  const closeModal = () => {
    modalizeRef.current?.close();
  };

  return (
    <>
      <HeaderBack title="Claim Garansi" search={false} />
      <ScrollView style={styles.container}>
        <Image
          style={{width: WINDOW_WIDTH, height: WINDOW_WIDTH * 0.7}}
          resizeMode="contain"
          source={assets['online_shopping']}
        />
        <View style={styles.formContainer}>
          <TextInput
            style={{
              backgroundColor: '#fff',
            }}
            label="Nama Anda"
            mode="outlined"
            placeholder="Nama Anda"
            returnKeyType="next"
            value={name}
            onChangeText={text => setName(text)}
            autoCapitalize="none"
          />
          <TextInput
            style={{
              backgroundColor: '#fff',
            }}
            label="Kode Garansi"
            mode="outlined"
            placeholder="Kode Garansi"
            returnKeyType="next"
            value={kodeGaransi}
            onChangeText={text => setKodeGaransi(text)}
            autoCapitalize="none"
          />
          <List.Item
            style={{
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
            }}
            title="Provinsi"
            description={shippingSelected?.shipping_name || 'Pilih Alamat'}
            right={() => <List.Icon icon="chevron-down" />}
            onPress={() => {
              openModal();
            }}
          />
          {shippingSelected && (
            <View style={styles.shippingDetailContainer}>
              <Text style={styles.shippingDetailText}>
                {`${shippingSelected.shipping_address}, ${shippingSelected.subdis_name}, ${shippingSelected.city_name}, ${shippingSelected.prov_name}, ${shippingSelected.zip_code}`}
              </Text>
            </View>
          )}
          <Button
            loading={progress}
            disabled={!(!progress && kodeGaransi && name && shippingSelected)}
            style={{padding: 8}}
            mode="contained"
            onPress={handleClaimPress}>
            Claim Warranty
          </Button>
        </View>
      </ScrollView>
      <Modalize
        ref={modalizeRef}
        modalHeight={Dimensions.get('window').height * 0.7}>
        <ScrollView style={{padding: 16}}>
          <Title>Alamat Anda</Title>
          {shippings ? (
            shippings.map(d => {
              return (
                <>
                  <List.Item
                    titleNumberOfLines={3}
                    title={`${d.shipping_name}, ${d.shipping_address}, ${d.subdis_name}, ${d.city_name}, ${d.prov_name}, ${d.zip_code}`}
                    onPress={() => {
                      setShippingSelected(d);
                      closeModal();
                    }}
                  />
                  <Divider />
                </>
              );
            })
          ) : (
            <View style={{flex: 1}}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </ScrollView>
      </Modalize>
      <Modalize
        ref={modalizeResult}
        modalHeight={Dimensions.get('window').height * 0.3}>
        <View style={{padding: 16}}>
          {dataGaransi ? (
            <>
              <Title>{dataGaransi.message}</Title>
              <Text style={styles.modalText}>
                Silahkan tekan kode dibawah ini untuk menyalin kode voucher
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(dataGaransi.data.vc_code);
                  ToastAndroid.show('Kode voucher disalin', ToastAndroid.SHORT);
                }}>
                <View style={styles.voucherContainer}>
                  <View style={styles.stickyNote}>
                    <Text style={styles.code}>{dataGaransi.data.vc_code}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Title>Claim Failed</Title>
              <Text style={styles.modalText}>{error}</Text>
            </>
          )}
        </View>
      </Modalize>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  shippingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shippingDetailContainer: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  shippingDetailText: {
    marginBottom: 4,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
  },
  voucherContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  stickyNote: {
    backgroundColor: '#fffde7',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  code: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Warranty;
