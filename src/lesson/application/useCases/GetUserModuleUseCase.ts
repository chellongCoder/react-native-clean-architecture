import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import {GetUserModuleResponse} from '../types/GetUserModuleResponse';
import {GetUserModuleRequest} from '../types/GetUserModuleRequest';

@injectable()
export default class GetUserModuleUseCase
  implements UseCase<GetUserModuleRequest, Promise<GetUserModuleResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute(params?: GetUserModuleRequest) {
    return this.lessonRepository.getUserModule(params);
  }
}
