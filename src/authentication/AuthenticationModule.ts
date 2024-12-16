import {getModuleContainer, module} from 'inversify-sugar';
import {AuthenticationStore} from './presentation/stores/AuthenticationStore';
import LoginUsernamePasswordUseCase from './application/useCases/LoginUsernamePasswordUsecase';
import {IAuthenticationRepositoryToken} from './domain/IAuthenRepository';
import AuthenticationRepository from './infrastructure/implementations/AuthenticationRepository';
import RegisterUseCase from './application/useCases/RegisterUsecase';
import RegisterChildUseCase from './application/useCases/RegisterChildUsecase';
import GetListSubjectUseCase from './application/useCases/GetListSubjectUsecase';
import GetUserProfileUseCase from './application/useCases/GetUserProfile';
import RefreshTokenUseCase from './application/useCases/RefreshTokenUseCase';
import LogOutUseCase from './application/useCases/LogoutUsecase';
import ComparePasswordUseCase from './application/useCases/ComparePasswordUsecase';
import ChangeParentNameUseCase from './application/useCases/ChangeParentNameUsecase';
import AssignChildrenUseCase from './application/useCases/AssignChildrenUsecase';
import DeleteChildrenUseCase from './application/useCases/DeleteChildrenUsecase';
import ChangeChildDescriptionUseCase from './application/useCases/ChangeChildDescriptionUsecase';
import LoginGoogleUserCase from './application/useCases/LoginGoogleUserCase';
import PostReportUseCase from './application/useCases/PostReportUseCase';
import ForceUpdateAppUseCase from './application/useCases/ForceUpdateAppUseCase';

@module({
  providers: [
    {
      useClass: AuthenticationStore,
      scope: 'Singleton',
    },
    {
      useClass: AuthenticationRepository,
      provide: IAuthenticationRepositoryToken,
    },
    LoginUsernamePasswordUseCase,
    RegisterUseCase,
    RegisterChildUseCase,
    GetListSubjectUseCase,
    GetUserProfileUseCase,
    RefreshTokenUseCase,
    LogOutUseCase,
    ComparePasswordUseCase,
    ChangeParentNameUseCase,
    AssignChildrenUseCase,
    DeleteChildrenUseCase,
    LoginGoogleUserCase,
    ChangeChildDescriptionUseCase,
    PostReportUseCase,
    ForceUpdateAppUseCase,
  ],
})
export class AuthenticationModule {}

export const authenticationModuleContainer =
  getModuleContainer(AuthenticationModule);
