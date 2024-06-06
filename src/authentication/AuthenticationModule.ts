import {getModuleContainer, module} from 'inversify-sugar';
import {AuthenticationStore} from './presentation/stores/AuthenticationStore';
import LoginUsernamePasswordUseCase from './application/useCases/LoginUsernamePasswordUsecase';
import {IAuthenticationRepositoryToken} from './domain/IAuthenRepository';
import AuthenticationRepository from './infrastructure/implementations/AuthenticationRepository';
import RegisterUseCase from './application/useCases/RegisterUsecase';

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
  ],
})
export class AuthenticationModule {}

export const authenticationModuleContainer =
  getModuleContainer(AuthenticationModule);
