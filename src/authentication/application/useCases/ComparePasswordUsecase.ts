import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {ComparePasswordPayload} from '../types/ComparePasswordPayload';
import {ComparePasswordResponse} from '../types/ComparePasswordResponse';

@injectable()
export default class ComparePasswordUseCase
  implements UseCase<ComparePasswordPayload, Promise<ComparePasswordResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: ComparePasswordPayload) {
    return this.authenticationRepository.comparePassword(data);
  }
}
