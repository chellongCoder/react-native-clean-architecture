import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import TopRankingPayload from '../types/TopRankingPayload';
import TopRankingResponse from '../types/TopRankingResponse';

@injectable()
export default class GetTopRankingUseCase
  implements UseCase<TopRankingPayload, Promise<TopRankingResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute(payload: TopRankingPayload) {
    return this.lessonRepository.getTopRanking(payload);
  }
}
