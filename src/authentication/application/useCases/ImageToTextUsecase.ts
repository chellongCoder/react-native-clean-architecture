import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import {ImageToTextResponse} from '../types/ImageToTextResponse';

@injectable()
export default class ImageToTextUsecase
  implements UseCase<FormData, Promise<ImageToTextResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute(data: FormData) {
    return this.lessonRepository.imageToText(data);
  }
}
