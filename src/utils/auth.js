import AsyncStorage from '@react-native-async-storage/async-storage';
export const isLogin = async () => {
  const api_token = await AsyncStorage.getItem('api_token');
  if (api_token) {
    return await true;
  }
  return await false;
};
