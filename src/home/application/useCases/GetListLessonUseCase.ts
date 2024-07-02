import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {IHomeRepository} from 'src/home/domain/IHomeRepository';
import {GetListLessonPayload} from '../types/GetListLessonPayload';
import GetListLessonResponse from '../types/GetListLessonResponse';

@injectable()
export default class GetListLessonUseCase
  implements UseCase<GetListLessonPayload, Promise<GetListLessonResponse>>
{
  constructor(
    @provided(IHomeRepository)
    private readonly homeRepository: IHomeRepository,
  ) {}

  public execute(
    fieldId: GetListLessonPayload,
  ): Promise<GetListLessonResponse> {
    return this.homeRepository.getListLesson(fieldId);
  }
}
