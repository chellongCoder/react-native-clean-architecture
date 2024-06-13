import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import GetUserProfileResponse from '../types/GetUserProfileResponse';

@injectable()
export default class GetUserProfileUseCase
  implements UseCase<any, Promise<GetUserProfileResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute() {
    return this.authenticationRepository.getUserProfile();
  }
}
