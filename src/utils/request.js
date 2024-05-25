import axios from 'axios';
import Cookies from 'js-cookie';
import { enqueueSnackbar } from 'notistack';

import { JWT_COOKIE } from './constant';

const request = axios.create({
  baseURL: `${import.meta.env.VITE_API_ROOT}/api`,
  timeout: 20000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

const onRequest = (config) => {
  const jwt = Cookies.get(JWT_COOKIE);

  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }

  return config;
};

const onRequestError = (error) => {
  enqueueSnackbar('Thất bại!', {
    variant: 'error',
    autoHideDuration: 1000
  });
  return Promise.reject(error);
};

const onResponse = (response) => response;

const onResponseError = (error) => {
  enqueueSnackbar('Thất bại!', {
    variant: 'error',
    autoHideDuration: 1000
  });
  return Promise.reject(error);
};

request.interceptors.request.use(onRequest, onRequestError);
request.interceptors.response.use(onResponse, onResponseError);

export default request;
