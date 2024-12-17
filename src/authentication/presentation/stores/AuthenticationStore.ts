import {injectable, provided} from 'inversify-sugar';
import {action, makeAutoObservable, observable} from 'mobx';
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
import GetUserProfileResponse, {
  children,
} from 'src/authentication/application/types/GetUserProfileResponse';
import ChangeParentNameUseCase from 'src/authentication/application/useCases/ChangeParentNameUsecase';
import {ChangeParentNamePayload} from 'src/authentication/application/types/ChangeParentNamePayload';
import {getAndroidId, getDeviceToken} from 'react-native-device-info';
import AssignChildrenUseCase from 'src/authentication/application/useCases/AssignChildrenUsecase';
import {isAndroid} from 'src/core/presentation/utils';
import DeleteChildrenUseCase from 'src/authentication/application/useCases/DeleteChildrenUsecase';
import ChangeChildDescriptionUseCase from 'src/authentication/application/useCases/ChangeChildDescriptionUsecase';
import {ChangeChildDescriptionPayload} from 'src/authentication/application/types/ChangeChildDescriptionPayload';
import {resetNavigator} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import LoginGoogleUserCase from 'src/authentication/application/useCases/LoginGoogleUserCase';
import {LoginGooglePayload} from 'src/authentication/application/types/LoginGooglePayload';
import PostReportUseCase from 'src/authentication/application/useCases/PostReportUseCase';
import {PostReportPayload} from 'src/authentication/application/types/PostReportPayload';
import ForceUpdateAppUseCase from 'src/authentication/application/useCases/ForceUpdateAppUseCase';
import {ForceUpdateAppPayload} from 'src/authentication/application/types/ForceUpdateAppPayload';
import {ForceUpdateAppResponse} from 'src/authentication/application/types/ForceUpdateAppResponse';
@injectable()
export class AuthenticationStore implements AuthenticationStoreState {
  isLoading = false;
  @persist token = '';
  @persist refreshToken = '';
  @persist loginMethod = '';
  error = '';
  isHydrated = false;
  selectedChild: children | undefined = undefined;
  @persist deviceToken = '1234567891011';
  @observable userProfile?: GetUserProfileResponse['data'];
  @observable appInfo?: ForceUpdateAppResponse['data'];

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

    @provided(AssignChildrenUseCase)
    private assignChildrenUseCase: AssignChildrenUseCase,

    @provided(DeleteChildrenUseCase)
    private deleteChildrenUseCase: DeleteChildrenUseCase,

    @provided(ChangeChildDescriptionUseCase)
    private changeChildDescriptionUseCase: ChangeChildDescriptionUseCase,

    @provided(LoginGoogleUserCase)
    private loginGoogleUserCase: LoginGoogleUserCase,

    @provided(PostReportUseCase)
    private postReportUserCase: PostReportUseCase,

    @provided(ForceUpdateAppUseCase)
    private forceUpdateAppUseCase: ForceUpdateAppUseCase,

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
    this.handlePostReport = this.handlePostReport.bind(this);
    this.handleGetForceUpdateApp = this.handleGetForceUpdateApp.bind(this);
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
    this.userProfile = response.data;
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
    resetNavigator(STACK_NAVIGATOR.AUTH_NAVIGATOR, {
      screen: STACK_NAVIGATOR.AUTH.LOGIN_SCREEN,
    });
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
  public async setSelectedChild(child: children) {
    this.selectedChild = child;

    let deviceToken;

    if (isAndroid) {
      await getAndroidId().then((androidId: string) => {
        deviceToken = androidId;
      });
    } else {
      await getDeviceToken().then((iosId: string) => {
        deviceToken = iosId;
      });
    }
    const response = await this.assignChildrenUseCase.execute({
      deviceToken: deviceToken || '',
      childrenId: child._id,
    });
    console.log('response: ', response, deviceToken);

    if (deviceToken) {
      this.deviceToken = deviceToken;
    }
  }

  @action
  public async changeParentName(data: ChangeParentNamePayload) {
    this.setIsLoading(true);
    const response = await this.changeParentNameUseCase.execute(data);
    this.setIsLoading(false);
    return response;
  }

  @action
  public async deleteChildren(childrenId: string) {
    this.setIsLoading(true);
    const response = await this.deleteChildrenUseCase.execute(childrenId);
    this.setIsLoading(false);
    return response;
  }

  @action
  public async changeChildrenDescription(data: ChangeChildDescriptionPayload) {
    this.setIsLoading(true);
    const response = await this.changeChildDescriptionUseCase.execute(data);
    this.setIsLoading(false);
    return response;
  }

  @action
  public async loginWithGoogle(args: LoginGooglePayload) {
    this.setIsLoading(true);
    const response = await this.loginGoogleUserCase.execute(args);
    this.setCurrentCredentials(response);
    this.setLoginMethod(LoginMethods.Google);
    this.setIsLoading(false);
    return response;
  }

  @action
  public async handlePostReport(args: PostReportPayload) {
    this.setIsLoading(true);
    const response = await this.postReportUserCase.execute(args);
    this.setIsLoading(false);
    return response;
  }

  @action
  public async handleGetForceUpdateApp(args: ForceUpdateAppPayload) {
    this.setIsLoading(true);
    const response = await this.forceUpdateAppUseCase.execute(args);
    this.setIsLoading(false);
    return response;
  }
}

export const hydrate = create({
  storage: AsyncStorage, // or AsyncStorage in react-native.
  // default: localStorage
  jsonify: true, // if you use AsyncStorage, here shoud be true
  // default: true
});
