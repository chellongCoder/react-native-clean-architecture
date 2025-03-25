import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import {GetUserModuleResponse} from '../types/GetUserModuleResponse';

@injectable()
export default class GetUserModuleUseCase
  implements UseCase<void, Promise<GetUserModuleResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute() {
    return this.lessonRepository.getUserModule();
  }
}
