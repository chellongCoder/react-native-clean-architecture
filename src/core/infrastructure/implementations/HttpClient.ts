import axios, {AxiosRequestConfig} from 'axios';
import {provided, injectable} from 'inversify-sugar';
import IHttpClient from '../../domain/specifications/IHttpClient';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {Credentials} from '../models/Crendentials';

@injectable()
class HttpClient implements IHttpClient {
  private axios: typeof axios;

  constructor(@provided(EnvToken) private readonly env: Env) {
    this.axios = axios;

    axios.interceptors.request.use(requestConfig => {
      requestConfig.baseURL = this.env.EXPO_BASE_API_DOMAIN;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      requestConfig.headers = {
        ...requestConfig.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: this.env.EXPO_BASE_API_DOMAIN,
      };

      return requestConfig;
    });

    this.axios.interceptors.response.use(undefined, err => {
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          // TODO: logout
        }
      }

      return Promise.reject(err);
    });
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
}

export default HttpClient;
