import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {UpdatePasswordPayload} from '../types/UpdatePasswordPayload';
import {UpdatePasswordResponse} from '../types/UpdatePasswordResponse';

@injectable()
export default class UpdatePasswordUseCase
  implements UseCase<UpdatePasswordPayload, Promise<UpdatePasswordResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: UpdatePasswordPayload) {
    return this.authenticationRepository.updatePassword(data);
  }
}
