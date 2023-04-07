import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Divider, List, RadioButton, TextInput, Title} from 'react-native-paper';
import Button from '../../../components/Button';
import HeaderBack from '../../../components/HeaderBack';
import {Modalize} from 'react-native-modalize';
import {api} from '../../../configs/api';
import {RNToasty} from 'react-native-toasty';
import {colors} from '../../../constants/colors';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddShipping = ({navigation, route}) => {
  const {user_id} = route.params;
  const [areasTitle, setAreasTitle] = useState(null);
  const [areas, setAreas] = useState(null);

  const [data, setData] = useState({
    shipping_name: 'Rumah',
    pic_name: '',
    pic_phone: '',
    city_name: '',
    province_name: '',
    dis_name: '',
    subdis_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_province: '',
    shipping_dis: '',
    shipping_subdis: '',
    zip_code: '',
  });

  const modalizeRef = useRef(null);

  const getProvince = async () => {
    await api
      .get('/shipping/province')
      .then(res => {
        if (res.data.success) {
          setAreas(res.data.data);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        }
        console.log(res.data);
      })
      .catch(err => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const getCity = async () => {
    await api
      .get(`/shipping/province/${data.shipping_province}/city`)
      .then(res => {
        if (res.data.success) {
          setAreas(res.data.data);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        }
        console.log(res.data);
      })
      .catch(err => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const getDistrict = async () => {
    await api
      .get(
        `/shipping/province/${data.shipping_province}/city/${data.shipping_city}/district`,
      )
      .then(res => {
        if (res.data.success) {
          setAreas(res.data.data);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        }
        console.log(res.data);
      })
      .catch(err => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const getSubdistrict = async () => {
    await api
      .get(
        `/shipping/province/${data.shipping_province}/city/${data.shipping_city}/district/${data.shipping_dis}/subdistrict`,
      )
      .then(res => {
        if (res.data.success) {
          setAreas(res.data.data);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        }
        console.log(res.data);
      })
      .catch(err => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };
  const getZip = async () => {
    await api
      .get(
        `/shipping/province/${data.shipping_province}/city/${data.shipping_city}/district/${data.shipping_dis}/subdistrict/${data.shipping_subdis}/zip`,
      )
      .then(res => {
        if (res.data.success) {
          setAreas(res.data.data);
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        }
        console.log(res.data);
      })
      .catch(err => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const createShipping = async () => {
    const api_token = await AsyncStorage.getItem('api_token');
    await api
      .post(`/user/${user_id}/shipping`, qs.stringify(data), {
        headers: {
          Authorization: 'Bearer ' + api_token,
        },
      })
      .then(res => {
        if (res.data.success) {
          RNToasty.Success({
            title: res.data.message,
            position: 'center',
          });
          navigation.goBack();
        } else {
          RNToasty.Error({
            title: res.data.message,
            position: 'center',
          });
        }
        console.log(res);
      })
      .catch(err => {
        RNToasty.Error({
          title: err.message,
          position: 'center',
        });
      });
  };

  const openModal = () => {
    modalizeRef.current?.open();
  };
  const closeModal = () => {
    modalizeRef.current?.close();
  };
  return (
    <>
      <Modalize
        ref={modalizeRef}
        modalHeight={Dimensions.get('window').height * 0.7}>
        <ScrollView style={{padding: 16}}>
          <Title>{areasTitle}</Title>
          {areas ? (
            areas.map(d => {
              return (
                <>
                  <List.Item
                    title={d.label}
                    onPress={() => {
                      switch (areasTitle) {
                        case 'Provinsi':
                          setData({
                            ...data,
                            shipping_province: d.id,
                            province_name: d.label,

                            shipping_city: null,
                            city_name: null,

                            shipping_dis: null,
                            dis_name: null,

                            shipping_subdis: null,
                            subdis_name: null,

                            zip_code: null,
                          });
                          break;

                        case 'Kota/Kabupaten':
                          setData({
                            ...data,
                            shipping_city: d.id,
                            city_name: d.label,

                            shipping_dis: null,
                            dis_name: null,

                            shipping_subdis: null,
                            subdis_name: null,

                            zip_code: null,
                          });
                          break;

                        case 'Kecamatan':
                          setData({
                            ...data,
                            shipping_dis: d.id,
                            dis_name: d.label,

                            shipping_subdis: null,
                            subdis_name: null,

                            zip_code: null,
                          });
                          break;

                        case 'Kelurahan/Desa':
                          setData({
                            ...data,
                            shipping_subdis: d.id,
                            subdis_name: d.label,

                            zip_code: null,
                          });
                          break;

                        case 'Kode Pos':
                          setData({
                            ...data,
                            zip_code: d.label,
                          });
                          break;

                        default:
                          break;
                      }
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
      <HeaderBack title="Tambah Alamat" search={false} />
      <ScrollView style={{paddingHorizontal: 8, paddingBottom: 24}}>
        <List.Subheader>Jenis Tempat</List.Subheader>
        <RadioButton.Group
          onValueChange={value => setData({...data, shipping_name: value})}
          value={data.shipping_name}>
          <RadioButton.Item label="Rumah" value="Rumah" />
          <RadioButton.Item label="Kantor" value="Kantor" />
        </RadioButton.Group>
        <List.Subheader>Detail Alamat</List.Subheader>
        <List.Item
          title="Provinsi"
          description={
            data.province_name || (
              <Text style={{color: colors.red}}>Pilih Provinsi!</Text>
            )
          }
          right={() => <List.Icon icon="chevron-down" />}
          onPress={() => {
            setAreasTitle('Provinsi');
            setAreas(null);
            getProvince();
            openModal();
          }}
        />
        <List.Item
          title="Kota/Kabupaten"
          description={
            data.city_name || (
              <Text style={{color: colors.red}}>Pilih Kota/Kabupaten!</Text>
            )
          }
          right={() => <List.Icon icon="chevron-down" />}
          onPress={() => {
            setAreasTitle('Kota/Kabupaten');
            setAreas(null);
            getCity();
            openModal();
          }}
        />
        <List.Item
          title="Kecamatan"
          description={
            data.dis_name || (
              <Text style={{color: colors.red}}>Pilih Kecamatan!</Text>
            )
          }
          right={() => <List.Icon icon="chevron-down" />}
          onPress={() => {
            setAreasTitle('Kecamatan');
            setAreas(null);
            getDistrict();
            openModal();
          }}
        />
        <List.Item
          title="Kelurahan/Desa"
          description={
            data.subdis_name || (
              <Text style={{color: colors.red}}>Pilih Kelurahan/Desa!</Text>
            )
          }
          right={() => <List.Icon icon="chevron-down" />}
          onPress={() => {
            setAreasTitle('Kelurahan/Desa');
            setAreas(null);
            getSubdistrict();
            openModal();
          }}
        />
        <List.Item
          title="Kode Pos"
          description={
            data.zip_code || (
              <Text style={{color: colors.red}}>Pilih Kode Pos!</Text>
            )
          }
          right={() => <List.Icon icon="chevron-down" />}
          onPress={() => {
            setAreasTitle('Kode Pos');
            setAreas(null);
            getZip();
            openModal();
          }}
        />

        <TextInput
          label="Nama Penerima"
          mode="outlined"
          placeholder="Nama Penerima"
          returnKeyType="next"
          value={data.pic_name}
          onChangeText={text =>
            setData({
              ...data,
              pic_name: text,
            })
          }
          autoCapitalize="none"
          style={{marginBottom: 8, marginHorizontal: 16}}
        />
        <TextInput
          label="Nomor HP Penerima"
          mode="outlined"
          placeholder="Nomor HP Penerima"
          returnKeyType="next"
          value={data.pic_phone}
          onChangeText={text =>
            setData({
              ...data,
              pic_phone: text,
            })
          }
          keyboardType="numeric"
          autoCapitalize="none"
          style={{marginBottom: 8, marginHorizontal: 16}}
        />
        <TextInput
          label="Detail Alamat"
          mode="outlined"
          placeholder="Nama jalan, Gang, RT/RW"
          returnKeyType="next"
          value={data.shipping_address}
          multiline
          numberOfLines={4}
          onChangeText={text =>
            setData({
              ...data,
              shipping_address: text,
            })
          }
          autoCapitalize="none"
          style={{marginBottom: 8, marginHorizontal: 16}}
        />
        <KeyboardAvoidingView
          keyboardVerticalOffset={64}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={{marginHorizontal: 16, zIndex: 1}}>
            <Button
              disabled={
                !data.zip_code ||
                !data.shipping_address ||
                !data.pic_phone ||
                !data.pic_name
              }
              mode="contained"
              onPress={() => createShipping()}>
              Simpan
            </Button>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

export default AddShipping;
