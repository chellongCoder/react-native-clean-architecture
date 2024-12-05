import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {LoginGooglePayload} from '../types/LoginGooglePayload';

@injectable()
export default class LoginGoogleUserCase
  implements UseCase<LoginGooglePayload, Promise<any>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: LoginGooglePayload): Promise<any> {
    return this.authenticationRepository.loginGoogle(data);
  }
}
