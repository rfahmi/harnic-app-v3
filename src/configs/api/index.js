import axios from 'axios';

export const app_version = 152;
export const app_version_name = '3.5.2';
export let baseURL = __DEV__
  ? 'http://10.0.2.2:8000/v3'
  : 'https://api3.harnic.id/v3';

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 5000,
});
