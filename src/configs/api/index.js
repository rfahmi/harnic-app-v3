import axios from 'axios';

export const app_version = 140;
export const app_version_name = '3.4.0';

export const api = axios.create({
  baseURL: __DEV__
    ? 'https://api3uat.harnic.id/v3'
    : 'https://api3.harnic.id/v3',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 5000,
});
