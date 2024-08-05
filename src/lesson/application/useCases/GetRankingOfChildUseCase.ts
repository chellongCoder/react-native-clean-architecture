import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import RankingOfChildPayload from '../types/RankingOfChildPayload';
import RankingOfChildResponse from '../types/RankingOfChildResponse';

@injectable()
export default class GetRankingOfChildUseCase
  implements UseCase<RankingOfChildPayload, Promise<RankingOfChildResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute(payload: RankingOfChildPayload) {
    return this.lessonRepository.getRankingOfChild(payload);
  }
}
