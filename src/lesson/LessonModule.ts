import {getModuleContainer, module} from 'inversify-sugar';
import {GetPostsStore} from './presentation/stores/GetPostsStore/GetPostsStore';
import {FindPostStore} from './presentation/stores/FindPostStore/FindPostStore';
import {IPostRepositoryToken} from './domain/specifications/IPostRepository';
import PostRepository from './infrastructure/implementations/PostRepository';
import FindPostUseCase from './application/useCases/FindPostUseCase';
import GetPostsUseCase from './application/useCases/GetPostsUseCase';
import {LessonStore} from './presentation/stores/LessonStore/LessonStore';
import {ILessonRepositoryToken} from './domain/specifications/ILessonRepository';
import LessonRepository from './infrastructure/implementations/LessonRepository';
import UpdateUserSettingUseCase from './application/useCases/UpdateUserSettingUseCase';
import PostUserProgressUseCase from './application/useCases/PostUserProgressUseCase';
import GetUserSettingUseCase from './application/useCases/GetUserSettingUseCase';
import GetReportProgressChildrenUseCase from './application/useCases/GetReportProgressChildrenUsecase';
import GetRankingOfChildUseCase from './application/useCases/GetRankingOfChildUseCase';
import GetTopRankingUseCase from './application/useCases/GetTopRankingUseCase';
import ChangeChildPointFlowerUsecase from 'src/authentication/application/useCases/ChangeChildPointFlowerUsecase';
import PurchaseModuleUseCase from './application/useCases/PurchaseModuleUseCase';
import GetProductUseCase from './application/useCases/getProductUseCase';

@module({
  providers: [
    {
      provide: IPostRepositoryToken,
      useClass: PostRepository,
    },
    {
      provide: ILessonRepositoryToken,
      useClass: LessonRepository,
    },
    FindPostUseCase,
    GetPostsUseCase,
    UpdateUserSettingUseCase,
    ChangeChildPointFlowerUsecase,
    GetUserSettingUseCase,
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
      scope: 'Singleton',
    },
    GetReportProgressChildrenUseCase,
    PostUserProgressUseCase,
    GetRankingOfChildUseCase,
    GetTopRankingUseCase,
    PurchaseModuleUseCase,
    GetProductUseCase,
  ],
})
export class LessonModule {}

export const lessonModuleContainer = getModuleContainer(LessonModule);
