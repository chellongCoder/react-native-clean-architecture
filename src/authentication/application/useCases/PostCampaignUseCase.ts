import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  IAuthenticationRepository,
  IAuthenticationRepositoryToken,
} from 'src/authentication/domain/IAuthenRepository';
import {PostCampaignPayload} from '../types/PostCampaignPayload';
import {PostCampaignResponse} from '../types/PostCampaignResponse';

@injectable()
export default class PostCampaignUseCase
  implements UseCase<PostCampaignPayload, Promise<PostCampaignResponse>>
{
  constructor(
    @provided(IAuthenticationRepositoryToken)
    private readonly authenticationRepository: IAuthenticationRepository,
  ) {}

  public execute(data: PostCampaignPayload) {
    return this.authenticationRepository.postCampaign(data);
  }
}
