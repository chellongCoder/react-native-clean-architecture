import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import UserSettingResponse from '../types/UserSettingResponse';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';

@injectable()
export default class GetUserSettingUseCase
  implements UseCase<string, Promise<UserSettingResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly postRepository: ILessonRepository,
  ) {}

  public execute(deviceToken: string) {
    return this.postRepository.getSettingDevice(deviceToken);
  }
}
