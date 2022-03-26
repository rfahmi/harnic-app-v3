import axios from 'axios';

export const app_version = 144;
export const app_version_name = '3.4.4';

export const api = axios.create({
  baseURL: __DEV__ ? 'https://api3.harnic.id/v3' : 'https://api3.harnic.id/v3',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 5000,
});
