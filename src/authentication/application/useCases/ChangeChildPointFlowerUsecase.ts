import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {ChangeChildPointFlowerPayload} from '../types/ChangeChildPointFlowerPayload';
import {ChangeChildPointFlowerResponse} from '../types/ChangeChildPointFlowerResponse';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';

@injectable()
export default class ChangeChildPointFlowerUsecase
  implements
    UseCase<
      ChangeChildPointFlowerPayload,
      Promise<ChangeChildPointFlowerResponse>
    >
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute(data: ChangeChildPointFlowerPayload) {
    return this.lessonRepository.changePointFlowerChild(data);
  }
}
