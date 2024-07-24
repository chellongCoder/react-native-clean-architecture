import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import UserSettingResponse from '../types/UserSettingResponse';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import UserSettingPayload from '../types/UserSettingPayload';

@injectable()
export default class GetUserSettingUseCase
  implements UseCase<UserSettingPayload, Promise<UserSettingResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly postRepository: ILessonRepository,
  ) {}

  public execute(payload: {deviceToken: string; childrenId: string}) {
    return this.postRepository.getSettingDevice(
      payload.deviceToken,
      payload.childrenId,
    );
  }
}
