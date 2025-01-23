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
import GetListModuleByFieldUseCase from 'src/home/application/useCases/GetListModuleByFieldUseCase';
import HomeRepository from 'src/home/infrastructure/HomeRepository';
import {IHomeRepository} from 'src/home/domain/IHomeRepository';
import {HomeStore} from 'src/home/presentation/stores/HomeStore';
import ImageToTextUsecase from 'src/authentication/application/useCases/ImageToTextUsecase';

@module({
  providers: [
    {
      useClass: LessonStore,
      scope: 'Singleton',
    },
    {
      useClass: HomeStore,
      scope: 'Singleton',
    },
    {
      provide: IPostRepositoryToken,
      useClass: PostRepository,
    },
    {
      provide: ILessonRepositoryToken,
      useClass: LessonRepository,
    },
    {
      provide: IHomeRepository,
      useClass: HomeRepository,
    },
    FindPostUseCase,
    GetPostsUseCase,
    UpdateUserSettingUseCase,
    ImageToTextUsecase,
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

    GetReportProgressChildrenUseCase,
    PostUserProgressUseCase,
    GetRankingOfChildUseCase,
    GetTopRankingUseCase,
    PurchaseModuleUseCase,
    GetProductUseCase,
    GetListModuleByFieldUseCase,
  ],
})
export class LessonModule {}

export const lessonModuleContainer = getModuleContainer(LessonModule);
