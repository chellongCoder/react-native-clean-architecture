import {injectable, provided} from 'inversify-sugar';
import {AxiosRequestConfig} from 'axios';

import IHttpClient, {
  IHttpClientToken,
} from 'src/core/domain/specifications/IHttpClient';
import {API_ENDPOINTS} from 'src/core/presentation/constants/apiEndpoints';
import {IAuthenticationRepository} from 'src/authentication/domain/IAuthenRepository';
import LoginResponse, {
  RefreshTokenResponse,
} from 'src/authentication/application/types/LoginResponse';
import {LoginUsernamePasswordPayload} from 'src/authentication/application/types/LoginPayload';
import {RegisterPayload} from 'src/authentication/application/types/RegisterPayload';
import RegisterResponse from 'src/authentication/application/types/RegisterResponse';
import {RegisterChildPayload} from 'src/authentication/application/types/RegisterChildPayload';
import RegisterChildResponse from 'src/authentication/application/types/RegisterChildResponse';
import GetListSubjectResponse from 'src/authentication/application/types/GetListSubjectResponse';
import GetUserProfileResponse from 'src/authentication/application/types/GetUserProfileResponse';
import {resetNavigator} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {ComparePasswordPayload} from 'src/authentication/application/types/ComparePasswordPayload';
import {ComparePasswordResponse} from 'src/authentication/application/types/ComparePasswordResponse';
import {ChangeParentNamePayload} from 'src/authentication/application/types/ChangeParentNamePayload';
import {ChangeParentNameResponse} from 'src/authentication/application/types/ChangeParentNameResponse';

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

  public async registerChild(
    args: RegisterChildPayload,
  ): Promise<RegisterChildResponse> {
    const response: RegisterResponse = await this.httpClient.post(
      API_ENDPOINTS.USER.REGISTER_CHILD,
      args,
    );
    return response;
  }

  public async getListAllSubject(): Promise<GetListSubjectResponse> {
    const response: GetListSubjectResponse = await this.httpClient.get(
      API_ENDPOINTS.SUBJECT.LIST_ALL_SUBJECT,
    );
    return response;
  }

  public async getUserProfile(): Promise<GetUserProfileResponse> {
    const response: GetUserProfileResponse = await this.httpClient.get(
      API_ENDPOINTS.USER.PROFILE,
    );
    return response;
  }

  public async getRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    const params = {
      refreshToken: refreshToken,
    };
    const response: RefreshTokenResponse = await this.httpClient.post(
      API_ENDPOINTS.AUTHENTICATION.REFRESH_TOKEN,
      params,
    );
    return response;
  }

  public async logOut(): Promise<void> {
    resetNavigator(STACK_NAVIGATOR.AUTH_NAVIGATOR);
    return;
  }

  public async comparePassword(
    data: ComparePasswordPayload,
  ): Promise<ComparePasswordResponse> {
    const response: ComparePasswordResponse = await this.httpClient.post(
      API_ENDPOINTS.USER.COMPARE_PASSWORD,
      data,
    );
    return response;
  }

  public async changeParentName(
    data: ChangeParentNamePayload,
  ): Promise<ChangeParentNameResponse> {
    const response: ChangeParentNameResponse = await this.httpClient.patch(
      API_ENDPOINTS.USER.CHANGE_PARENT_NAME,
      data,
    );
    return response;
  }
}

export default AuthenticationRepository;
