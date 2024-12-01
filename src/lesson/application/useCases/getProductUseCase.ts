import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';

@injectable()
export default class GetProductUseCase implements UseCase<Promise<any>> {
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  public execute() {
    return this.lessonRepository.getProductFromBE();
  }
}
