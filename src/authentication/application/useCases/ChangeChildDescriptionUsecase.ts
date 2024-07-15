import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {ChangeChildDescriptionPayload} from '../types/ChangeChildDescriptionPayload';
import {ChangeChildDescriptionResponse} from '../types/ChangeChildDescriptionResponse';

@injectable()
export default class ChangeChildDescriptionUseCase
  implements
    UseCase<
      ChangeChildDescriptionPayload,
      Promise<ChangeChildDescriptionResponse>
    >
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: ChangeChildDescriptionPayload) {
    return this.authenticationRepository.changeChildDescription(data);
  }
}
