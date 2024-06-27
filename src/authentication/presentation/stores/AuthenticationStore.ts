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
import {RegisterChildPayload} from 'src/authentication/application/types/RegisterChildPayload';
import RegisterChildUseCase from 'src/authentication/application/useCases/RegisterChildUsecase';
import GetListSubjectUseCase from 'src/authentication/application/useCases/GetListSubjectUsecase';
import GetUserProfileUseCase from 'src/authentication/application/useCases/GetUserProfile';
import RefreshTokenUseCase from 'src/authentication/application/useCases/RefreshTokenUseCase';
import LogOutUseCase from 'src/authentication/application/useCases/LogoutUsecase';
import * as Keychain from 'react-native-keychain';
import ComparePasswordUseCase from 'src/authentication/application/useCases/ComparePasswordUsecase';
import {ComparePasswordPayload} from 'src/authentication/application/types/ComparePasswordPayload';
import {children} from 'src/authentication/application/types/GetUserProfileResponse';
import ChangeParentNameUseCase from 'src/authentication/application/useCases/ChangeParentNameUsecase';
import {ChangeParentNamePayload} from 'src/authentication/application/types/ChangeParentNamePayload';

@injectable()
export class AuthenticationStore implements AuthenticationStoreState {
  isLoading = false;
  @persist token = '';
  @persist refreshToken = '';
  @persist loginMethod = '';
  error = '';
  isHydrated = false;
  selectedChild: children | undefined = undefined;

  constructor(
    @provided(LoginUsernamePasswordUseCase)
    private loginUsernamePasswordUseCase: LoginUsernamePasswordUseCase,

    @provided(RegisterUseCase)
    private registerUseCase: RegisterUseCase,

    @provided(RegisterChildUseCase)
    private registerChildUseCase: RegisterChildUseCase,

    @provided(GetListSubjectUseCase)
    private getListSubjectUseCase: GetListSubjectUseCase,

    @provided(GetUserProfileUseCase)
    private getUserProfileUseCase: GetUserProfileUseCase,

    @provided(RefreshTokenUseCase)
    private getRefreshTokenUseCase: RefreshTokenUseCase,

    @provided(LogOutUseCase)
    private postLogOutUseCase: LogOutUseCase,

    @provided(ComparePasswordUseCase)
    private comparePasswordUseCase: ComparePasswordUseCase,

    @provided(ChangeParentNameUseCase)
    private changeParentNameUseCase: ChangeParentNameUseCase,

    @provided(IHttpClientToken) private readonly httpClient: IHttpClient, // @provided(CoreStore) private coreStore: CoreStore,
  ) {
    this.loginUsernamePassword = this.loginUsernamePassword.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.setIsLoading = this.setIsLoading.bind(this);
    this.setLoginMethod = this.setLoginMethod.bind(this);
    this.removeCurrentCredentials = this.removeCurrentCredentials.bind(this);
    this.initializePersistence();
    this.register = this.register.bind(this);
    this.registerChild = this.registerChild.bind(this);
    this.getListAllSubject = this.getListAllSubject.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.getRefreshToken = this.getRefreshToken.bind(this);
    this.handleUserLogOut = this.handleUserLogOut.bind(this);
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
    this.refreshToken = response.data.refreshToken;
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
    console.log('response: ', response);
    if (response.error) {
      return response;
    }
    this.setCurrentCredentials(response);
    this.setLoginMethod(LoginMethods.UsernamePassword);
    this.setIsLoading(false);
    return response;
  }

  @action
  public async register(args: RegisterPayload) {
    this.setIsLoading(true);
    const response = await this.registerUseCase.execute(args);
    if (response.error) {
      return response;
    }
    this.setCurrentCredentials(response);
    this.setIsLoading(false);
    return response;
  }

  @action
  public async registerChild(args: RegisterChildPayload) {
    this.setIsLoading(true);
    const response = await this.registerChildUseCase.execute(args);
    if (response.error) {
      return response;
    }
    this.setIsLoading(false);
    return response;
  }

  @action
  public async getListAllSubject() {
    this.setIsLoading(true);
    const response = await this.getListSubjectUseCase.execute();
    if (response.error) {
      return response;
    }
    this.setIsLoading(false);
    return response;
  }

  @action
  public async getUserProfile() {
    this.setIsLoading(true);
    const response = await this.getUserProfileUseCase.execute();
    if (response.error) {
      return response;
    }
    this.setIsLoading(false);
    return response;
  }

  @action
  public async getRefreshToken(refreshToken: string) {
    this.httpClient.setAuthCredentials({token: refreshToken});
    const response = await this.getRefreshTokenUseCase.execute(refreshToken);
    // Set new access token
    this.httpClient.setAuthCredentials({token: response.data.accessToken});
    return response;
  }

  @action
  public async handleUserLogOut() {
    this.removeCurrentCredentials();
    try {
      await Keychain.resetGenericPassword();
    } catch (error) {
      console.log('clearUsernamePasswordInKeychain: ', error);
    }
    this.postLogOutUseCase.execute();
  }

  @action
  public async comparePassword(data: ComparePasswordPayload) {
    this.setIsLoading(true);
    const response = await this.comparePasswordUseCase.execute(data);
    if (response.code) {
      return response;
    }
    this.setIsLoading(false);
    return response;
  }

  @action
  public setSelectedChild(child: children) {
    this.selectedChild = child;
  }

  @action
  public async changeParentName(data: ChangeParentNamePayload) {
    this.setIsLoading(true);
    const response = await this.changeParentNameUseCase.execute(data);
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
