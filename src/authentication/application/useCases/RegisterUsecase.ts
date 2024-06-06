import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {RegisterPayload} from '../types/RegisterPayload';
import RegisterResponse from '../types/RegisterResponse';

@injectable()
export default class RegisterUseCase
  implements UseCase<RegisterPayload, Promise<RegisterResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: RegisterPayload): Promise<RegisterResponse> {
    return this.authenticationRepository.registerUser(data);
  }
}
