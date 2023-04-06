import axios from 'axios';
import debounce from 'debounce';

export const app_version = 168;
export const app_version_name = '3.6.8';
export let baseURL = __DEV__
  ? 'https://api3.harnic.id/v3'
  : // 'http://10.0.2.2:8000/v3'
    'https://api3.harnic.id/v3';

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 5000,
});

const source = axios.CancelToken.source();

const debounceHttpCall = (httpFunction, debounceTime) => {
  const debouncedFunction = debounce(httpFunction, debounceTime);

  return async (method, ...args) => {
    const response = await debouncedFunction(...args, {method});
    return response.data;
  };
};

const api2 = debounceHttpCall(api.request, 500);

export {api, api2, source};
