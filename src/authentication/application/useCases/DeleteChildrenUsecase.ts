import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import DeleteChildrenResponse from '../types/DeleteChildrenResponse';

@injectable()
export default class DeleteChildrenUseCase
  implements UseCase<string, Promise<DeleteChildrenResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(childrenId: string) {
    return this.authenticationRepository.deleteChildren(childrenId);
  }
}
