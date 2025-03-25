import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import BuyUserModulePayload from '../types/BuyUserModulePayload';
import BuyUserModuleResponse from '../types/BuyUserModuleResponse';

@injectable()
export default class BuyUserModuleUseCase
  implements UseCase<BuyUserModulePayload, Promise<BuyUserModuleResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute(payload: BuyUserModulePayload) {
    return this.lessonRepository.buyUserModule(payload);
  }
}
