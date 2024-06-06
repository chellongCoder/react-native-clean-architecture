import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import LoginResponse from '../types/LoginResponse';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {LoginUsernamePasswordPayload} from '../types/LoginPayload';

@injectable()
export default class LoginUsernamePasswordUseCase
  implements UseCase<LoginUsernamePasswordPayload, Promise<LoginResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: LoginUsernamePasswordPayload) {
    return this.authenticationRepository.loginWithCredentials(data);
  }
}
