import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {ChangeParentNamePayload} from '../types/ChangeParentNamePayload';
import {ChangeParentNameResponse} from '../types/ChangeParentNameResponse';

@injectable()
export default class ChangeParentNameUseCase
  implements
    UseCase<ChangeParentNamePayload, Promise<ChangeParentNameResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: ChangeParentNamePayload) {
    return this.authenticationRepository.changeParentName(data);
  }
}
