import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {IHomeRepository} from 'src/home/domain/IHomeRepository';
import {GetListLessonPayload} from '../types/GetListLessonPayload';
import GetListQuestionResponse from '../types/GetListQuestionResponse';

@injectable()
export default class GetListQuestionUseCase
  implements UseCase<GetListLessonPayload, Promise<GetListQuestionResponse>>
{
  constructor(
    @provided(IHomeRepository)
    private readonly homeRepository: IHomeRepository,
  ) {}

  public execute(
    fieldId: Partial<GetListLessonPayload>,
  ): Promise<GetListQuestionResponse> {
    return this.homeRepository.getListLessonQuestions(fieldId);
  }
}
