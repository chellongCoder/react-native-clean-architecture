import {AxiosRequestConfig} from 'axios';
import {Credentials} from 'src/core/infrastructure/models/Crendentials';

export const IHttpClientToken = Symbol('IHttpClient');

export default interface IHttpClient {
  setAuthCredentials: (credentials: Credentials) => void;
  removeCurrentCredentials: () => void;

  get<ResponseType>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseType>;

  post<DataType, ResponseType>(
    url: string,
    data?: DataType,
    config?: AxiosRequestConfig,
  ): Promise<ResponseType>;

  patch<DataType, ResponseType>(
    url: string,
    data?: DataType,
    config?: AxiosRequestConfig,
  ): Promise<ResponseType>;

  delete<ResponseType>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseType>;
}
