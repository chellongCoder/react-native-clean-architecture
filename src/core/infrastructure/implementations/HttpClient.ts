import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {provided, injectable} from 'inversify-sugar';
import IHttpClient from '../../domain/specifications/IHttpClient';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {Credentials} from '../models/Crendentials';
import {authenticationModuleContainer} from 'src/authentication/AuthenticationModule';
import {AuthenticationStore} from 'src/authentication/presentation/stores/AuthenticationStore';

@injectable()
class HttpClient implements IHttpClient {
  private axios: typeof axios;
  private isRefreshing = false;
  private requestQueue: ((config: AxiosRequestConfig) => Promise<any>)[] = [];

  constructor(@provided(EnvToken) private readonly env: Env) {
    this.axios = axios;

    this.axios.interceptors.request.use(requestConfig => {
      requestConfig.baseURL = this.env.EXPO_BASE_V1_API_DOMAIN;

      // Get the authentication store to access deviceToken
      const store =
        authenticationModuleContainer.getProvided(AuthenticationStore);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      requestConfig.headers = {
        'Content-Type': 'application/json; charset=utf-8',
        // Spread existing headers Content-Type (if any) from requestConfig.
        ...requestConfig.headers,
        Accept: 'application/json',
        Origin: this.env.EXPO_BASE_V1_API_DOMAIN,
        ...(store.deviceToken && {'X-Device-Token': store.deviceToken}),
      };

      requestConfig.timeout = 5000;
      requestConfig.responseEncoding = 'utf-8';
      return requestConfig;
    });

    this.axios.interceptors.response.use(
      response => {
        console.log(
          '🛠 LOG: 🚀 --> ~ HttpClient ~ constructor ~ response:',
          response,
        );
        return response;
      },
      async (error?: Record<string, any> | undefined) => {
        console.log('🛠 LOG: 🚀 --> ~ HttpClient ~ constructor ~ error:', error);
        const originalRequest = error?.config;
        const store =
          authenticationModuleContainer.getProvided(AuthenticationStore);
        const {getRefreshToken, handleUserLogOut, refreshToken} = store;

        const isExpiredStatus =
          error?.response?.status === 401 || error?.response?.status === 403;
        if (error?.response && !originalRequest._retry && isExpiredStatus) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            originalRequest._retry = true;

            try {
              getRefreshToken(refreshToken)
                .then(response => {
                  this.requestQueue.forEach(callback =>
                    callback({
                      ...originalRequest,
                      headers: {
                        Authorization: `Bearer ${response.data.accessToken}`,
                      },
                    }),
                  );
                  this.requestQueue = [];
                })
                .catch((err: AxiosError) => {
                  console.log('RefresshToken failed: ', err);
                  handleUserLogOut();
                });
            } catch (err) {
              handleUserLogOut();
              return Promise.reject(err);
            } finally {
              this.isRefreshing = false;
            }
          }

          return this.requestQueue.push((config: AxiosRequestConfig) => {
            return this.axios({...config});
          });
        }

        return Promise.reject(error);
      },
    );
  }
  public setAuthCredentials(credentials: Credentials) {
    this.axios.defaults.headers.common.Authorization = `Bearer ${credentials.token}`;
  }

  public removeCurrentCredentials() {
    this.axios.defaults.headers.common.Authorization = '';
  }

  public async get<ResponseType>(url: string, config?: AxiosRequestConfig) {
    const response = await this.axios.get<ResponseType>(url, config);
    return response.data;
  }

  public async post<DataType, ResponseType>(
    url: string,
    data?: DataType,
    config?: AxiosRequestConfig,
  ) {
    const response = await this.axios.post<ResponseType>(url, data, config);
    return response.data;
  }

  public async upload<DataType, ResponseType>(
    url: string,
    data?: DataType,
    config?: AxiosRequestConfig,
  ) {
    const response = await axios.post<ResponseType>(url, data, config);
    return response.data;
  }

  public async patch<DataType, ResponseType>(
    url: string,
    data?: DataType,
    config?: AxiosRequestConfig,
  ) {
    const response = await this.axios.patch<ResponseType>(url, data, config);
    return response.data;
  }

  public async delete<ResponseType>(url: string, config?: AxiosRequestConfig) {
    const response = await this.axios.delete<ResponseType>(url, config);
    return response.data;
  }

  public setDeviceToken(deviceToken: string) {
    this.axios.defaults.headers.common['X-Device-Token'] = deviceToken;
  }
}

export default HttpClient;
