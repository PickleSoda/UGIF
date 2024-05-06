import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
axios.defaults.withCredentials = false;
import { userStore } from '../store/userStore';

interface InternalCustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const client: AxiosInstance = axios.create({
  withCredentials: false,
  baseURL: process.env.REACT_APP_API || 'https://gifs.unclothed.com',
});

let accessToken: string | null = userStore.getRawState().token;

const onRequest = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  accessToken = userStore.getRawState().token;
  if (accessToken) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    console.log("token init")
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  if (response.config.url === '/register' || response.config.url === '/login') {
    const accessTokenFromServer = response.data.token;

    if (accessTokenFromServer) {
      accessToken = accessTokenFromServer;
      client.defaults.headers.common['Authorization'] =
        `Bearer ${accessTokenFromServer}`;
    }
  }

  return response;
};

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
  const originalRequest = error.config! as InternalCustomAxiosRequestConfig;

  if (error.response?.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const newAccessToken = userStore.getRawState().token;

      accessToken = newAccessToken;

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      } else {
        originalRequest.headers = {
          Authorization: `Bearer ${newAccessToken}`,
        };
      }

      return client(originalRequest);
    } catch (tokenError) {
      return Promise.reject(tokenError);
    }
  }
  return Promise.reject(error);
};

client.interceptors.request.use(onRequest, onRequestError);
client.interceptors.response.use(onResponse, onResponseError);

export const request = (
  options: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  const onSuccess = (response: AxiosResponse) => response;
  const onError = (error: any) => {
    throw error;
  };

  return client(options).then(onSuccess).catch(onError);
};
