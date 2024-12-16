import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {ForceUpdateAppResponse} from '../types/ForceUpdateAppResponse';
import {ForceUpdateAppPayload} from '../types/ForceUpdateAppPayload';

@injectable()
export default class ForceUpdateAppUseCase
  implements UseCase<ForceUpdateAppPayload, Promise<ForceUpdateAppResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(args: ForceUpdateAppPayload) {
    return this.authenticationRepository.forceUpdateApp(args);
  }
}
