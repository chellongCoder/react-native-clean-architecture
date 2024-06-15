import {getModuleContainer, module} from 'inversify-sugar';
import {GetPostsStore} from './presentation/stores/GetPostsStore/GetPostsStore';
import {FindPostStore} from './presentation/stores/FindPostStore/FindPostStore';
import {IPostRepositoryToken} from './domain/specifications/IPostRepository';
import PostRepository from './infrastructure/implementations/PostRepository';
import FindPostUseCase from './application/useCases/FindPostUseCase';
import GetPostsUseCase from './application/useCases/GetPostsUseCase';
import {LessonStore} from './presentation/stores/LessonStore/LessonStore';

@module({
  providers: [
    {
      provide: IPostRepositoryToken,
      useClass: PostRepository,
    },
    FindPostUseCase,
    GetPostsUseCase,
    {
      useClass: GetPostsStore,
      scope: 'Transient',
    },
    {
      useClass: FindPostStore,
      scope: 'Transient',
    },
    {
      useClass: LessonStore,
      scope: 'Transient',
    },
  ],
})
export class LessonModule {}

export const lessonModuleContainer = getModuleContainer(LessonModule);
