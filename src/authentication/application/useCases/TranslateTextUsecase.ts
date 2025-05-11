import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import {TranslateTextResponse} from '../types/TranslateTextResponse';
import {TranslateTextPayload} from '../types/TranslateTextPayload';

@injectable()
export default class TranslateTextUsecase
  implements UseCase<TranslateTextPayload, Promise<TranslateTextResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute(data: TranslateTextPayload) {
    return this.lessonRepository.translateText(data);
  }
}
