import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import UserSettingPayload from '../types/UserSettingPayload';
import UserSettingResponse from '../types/UserSettingResponse';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';

@injectable()
export default class UpdateUserSettingUseCase
  implements UseCase<UserSettingPayload, Promise<UserSettingResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly postRepository: ILessonRepository,
  ) {}

  public execute(data: UserSettingPayload) {
    return this.postRepository.updateBlockedApp(data);
  }
}
