import {injectable, provided} from 'inversify-sugar';
import {action, makeAutoObservable} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {create, persist} from 'mobx-persist';

import AuthenticationStoreState from './types/AuthenticationStoreState';
import IHttpClient, {
  IHttpClientToken,
} from 'src/core/domain/specifications/IHttpClient';
import LoginUsernamePasswordUseCase from 'src/authentication/application/useCases/LoginUsernamePasswordUsecase';
import LoginResponse from 'src/authentication/application/types/LoginResponse';
import {LoginUsernamePasswordPayload} from 'src/authentication/application/types/LoginPayload';
import {LoginMethods} from '../constants/common';
import RegisterUseCase from 'src/authentication/application/useCases/RegisterUsecase';
import {RegisterPayload} from 'src/authentication/application/types/RegisterPayload';

@injectable()
export class AuthenticationStore implements AuthenticationStoreState {
  isLoading = false;
  @persist token = '';
  @persist refreshToken = '';
  @persist loginMethod = '';
  error = '';
  isHydrated = false;

  constructor(
    @provided(LoginUsernamePasswordUseCase)
    private loginUsernamePasswordUseCase: LoginUsernamePasswordUseCase,

    @provided(RegisterUseCase)
    private registerUseCase: RegisterUseCase,

    @provided(IHttpClientToken) private readonly httpClient: IHttpClient, // @provided(CoreStore) private coreStore: CoreStore,
  ) {
    this.loginUsernamePassword = this.loginUsernamePassword.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.setIsLoading = this.setIsLoading.bind(this);
    this.setLoginMethod = this.setLoginMethod.bind(this);
    this.removeCurrentCredentials = this.removeCurrentCredentials.bind(this);
    this.initializePersistence();
    this.register = this.register.bind(this);
  }

  private async initializePersistence() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  @action
  public setErrorMessage(message: string) {
    this.error = message;
  }

  @action
  public setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @action
  public setCurrentCredentials(response: LoginResponse) {
    this.token = response.data.accessToken;
    this.httpClient.setAuthCredentials({token: response.data.accessToken});
  }

  @action
  public removeCurrentCredentials() {
    this.setIsLoading(true);
    this.token = '';
    this.refreshToken = '';
    this.loginMethod = '';
    this.httpClient.removeCurrentCredentials();
    this.setIsLoading(false);
  }

  @action
  public setLoginMethod(method: LoginMethods) {
    this.loginMethod = method;
  }

  @action
  public async loginUsernamePassword(args: LoginUsernamePasswordPayload) {
    this.setIsLoading(true);
    const response = await this.loginUsernamePasswordUseCase.execute(args);
    this.setCurrentCredentials(response);
    this.setLoginMethod(LoginMethods.UsernamePassword);
    this.setIsLoading(false);
    return response;
  }

  @action
  public async register(args: RegisterPayload) {
    this.setIsLoading(true);
    const response = await this.registerUseCase.execute(args);
    // this.setCurrentCredentials(response);
    this.setIsLoading(false);
    return response;
  }

  // @action
  // public async loginWithGoogle(args: LoginWithGooglePayload) {
  //   this.setIsLoading(true);
  //   const response = await this.loginWithGoogleUseCase.execute(args);
  //   this.setCurrentCredentials(response);
  //   this.setLoginMethod(LoginMethods.Google);
  //   this.setIsLoading(false);
  //   return response;
  // }
}

export const hydrate = create({
  storage: AsyncStorage, // or AsyncStorage in react-native.
  // default: localStorage
  jsonify: true, // if you use AsyncStorage, here shoud be true
  // default: true
});
