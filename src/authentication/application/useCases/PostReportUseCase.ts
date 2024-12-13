import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {PostReportPayload} from '../types/PostReportPayload';
import {PostReportResponse} from '../types/PostReportResponse';

@injectable()
export default class PostReportUseCase
  implements UseCase<PostReportPayload, Promise<PostReportResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: PostReportPayload) {
    return this.authenticationRepository.postReport(data);
  }
}
