import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import GetListSubjectResponse from '../types/GetListSubjectResponse';

@injectable()
export default class GetListSubjectUseCase
  implements UseCase<any, Promise<GetListSubjectResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute() {
    return this.authenticationRepository.getListAllSubject();
  }
}
