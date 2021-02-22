import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import Button from '../../../components/Button';
import HeaderBack from '../../../components/HeaderBack';

const UserPassword = ({navigation}) => {
  const [old, setOld] = useState({value: null, error: ''});
  const [new1, setNew1] = useState({value: null, error: ''});
  const [new2, setNew2] = useState({value: null, error: ''});
  return (
    <>
      <HeaderBack title="Ubah Password" search={false} />
      <ScrollView style={{margin: 16}}>
        <TextInput
          label="Password Lama"
          returnKeyType="next"
          value={old.value}
          onChangeText={(text) => setOld({value: text, error: ''})}
          error={!!old.error}
          errorText={old.error}
          autoCapitalize="none"
          style={{backgroundColor: 'transparent', marginBottom: 8}}
        />
        <TextInput
          label="Password Baru"
          returnKeyType="next"
          value={new1.value}
          onChangeText={(text) => setNew1({value: text, error: ''})}
          error={!!new1.error}
          errorText={new1.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={{backgroundColor: 'transparent', marginBottom: 8}}
        />
        <TextInput
          label="Ulangi Password Baru"
          returnKeyType="next"
          value={new2.value}
          onChangeText={(text) => setNew2({value: text, error: ''})}
          error={!!new2.error}
          errorText={new2.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={{backgroundColor: 'transparent', marginBottom: 8}}
        />
      </ScrollView>
      <View style={{margin: 16}}>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Simpan
        </Button>
      </View>
    </>
  );
};

export default UserPassword;
