import axios from 'axios';

export const app_version = 138;
export const app_version_name = '3.3.8';

export const api = axios.create({
  baseURL: 'https://apiv3.harnicid.com/v3',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 5000,
});
