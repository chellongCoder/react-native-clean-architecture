import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {
  ILessonRepository,
  ILessonRepositoryToken,
} from 'src/lesson/domain/specifications/ILessonRepository';
import PostUserProgressResponse from '../types/PostUserProgressResponse';
import {TResult} from 'src/lesson/presentation/screens/LessonScreen';

@injectable()
export default class PostUserProgressUseCase
  implements UseCase<TResult[], Promise<PostUserProgressResponse>>
{
  constructor(
    @provided(ILessonRepositoryToken)
    private readonly postRepository: ILessonRepository,
  ) {}

  public execute(data: TResult[]) {
    return this.postRepository.postUserProgress(data);
  }
}
