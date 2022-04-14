import axios from 'axios';

export const app_version = 145;
export const app_version_name = '3.4.5';
export let baseURL = __DEV__
  ? 'https://api3uat.harnic.id/v3'
  : 'https://api3.harnic.id/v3';

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 5000,
});
