import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import ReportProgressChildrenResponse from '../types/ReportProgressChildrenResponse';
import ReportProgressChildrenPayload from '../types/ReportProgressChildrenPayload';

@injectable()
export default class GetReportProgressChildrenUseCase
  implements
    UseCase<
      ReportProgressChildrenPayload,
      Promise<ReportProgressChildrenResponse>
    >
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute(payload: ReportProgressChildrenPayload) {
    return this.lessonRepository.getReportProgressChildren(payload);
  }
}
