import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {RegisterChildPayload} from '../types/RegisterChildPayload';
import RegisterChildResponse from '../types/RegisterChildResponse';

@injectable()
export default class RegisterChildUseCase
  implements UseCase<RegisterChildPayload, Promise<RegisterChildResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: RegisterChildPayload): Promise<RegisterChildResponse> {
    return this.authenticationRepository.registerChild(data);
  }
}
