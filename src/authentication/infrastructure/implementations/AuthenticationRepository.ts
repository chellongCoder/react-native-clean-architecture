import {injectable, provided} from 'inversify-sugar';
import {AxiosRequestConfig} from 'axios';

import IHttpClient, {
  IHttpClientToken,
} from 'src/core/domain/specifications/IHttpClient';
import {API_ENDPOINTS} from 'src/core/presentation/constants/apiEndpoints';
import {IAuthenticationRepository} from 'src/authentication/domain/IAuthenRepository';
import LoginResponse from 'src/authentication/application/types/LoginResponse';
import {LoginUsernamePasswordPayload} from 'src/authentication/application/types/LoginPayload';
import {RegisterPayload} from 'src/authentication/application/types/RegisterPayload';
import RegisterResponse from 'src/authentication/application/types/RegisterResponse';

@injectable()
class AuthenticationRepository implements IAuthenticationRepository {
  constructor(
    @provided(IHttpClientToken) private readonly httpClient: IHttpClient,
  ) {}

  public async loginWithCredentials(
    args: LoginUsernamePasswordPayload,
  ): Promise<LoginResponse> {
    const headers: AxiosRequestConfig['headers'] = {
      Authorization: 'Bearer xxx',
    };

    const config: AxiosRequestConfig = {
      headers,
    };
    const response: LoginResponse = await this.httpClient.post(
      API_ENDPOINTS.AUTHENTICATION.LOGIN_WITH_CREDENTIALS,
      args,
      config,
    );
    return response;
  }

  public async registerUser(args: RegisterPayload): Promise<RegisterResponse> {
    const headers: AxiosRequestConfig['headers'] = {
      Authorization: 'Bearer xxx',
    };

    const config: AxiosRequestConfig = {
      headers,
    };
    const response: RegisterResponse = await this.httpClient.post(
      API_ENDPOINTS.USER.REGISTER,
      args,
      config,
    );
    return response;
  }
}
export default AuthenticationRepository;
