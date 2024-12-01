import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import PurchaseModulePayload from '../types/PurchaseModulePayload';
import PurchaseModuleResponse from '../types/PurchaseModuleResponse';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';

@injectable()
export default class PurchaseModuleUseCase
  implements UseCase<PurchaseModulePayload, Promise<PurchaseModuleResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute(data: PurchaseModulePayload) {
    return this.lessonRepository.purchaseModule(data);
  }
}
