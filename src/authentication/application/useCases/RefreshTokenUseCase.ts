import {injectable, provided} from 'inversify-sugar';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';

@injectable()
export default class RefreshTokenUseCase {
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(refreshToken: string) {
    return this.authenticationRepository.getRefreshToken(refreshToken);
  }
}
