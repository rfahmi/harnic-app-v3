import axios from 'axios';

export const app_version = 127;
export const app_version_name = '3.2.7';

export const api = axios.create({
  baseURL: 'https://apiv3.harnic.id/v3',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 10000,
});
