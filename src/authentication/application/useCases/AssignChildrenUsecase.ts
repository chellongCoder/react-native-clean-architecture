import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {AssignChildrenPayload} from '../types/AssignChildrenPayload';
import {AssignChildrenResponse} from '../types/AssignChildrenResponse';

@injectable()
export default class AssignChildrenUseCase
  implements UseCase<AssignChildrenPayload, Promise<AssignChildrenResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: AssignChildrenPayload) {
    return this.authenticationRepository.assignChildren(data);
  }
}
