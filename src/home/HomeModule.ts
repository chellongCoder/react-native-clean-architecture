import {getModuleContainer, module} from 'inversify-sugar';
import HomeRepository from './infrastructure/HomeRepository';
import {IHomeRepository} from './domain/IHomeRepository';
import GetFieldUseCase from './application/useCases/GetFieldUseCase';
import {HomeStore} from './presentation/stores/HomeStore';
import GetListSubjectUseCase from './application/useCases/GetListSubjectUseCase';
import GetListLessonUseCase from './application/useCases/GetListLessonUseCase';
import GetListQuestionUseCase from './application/useCases/GetListQuestionUseCase';
import LoggingActionUseCase from './application/useCases/LoggingActionUseCase';

@module({
  providers: [
    {
      useClass: HomeStore,
      scope: 'Singleton',
    },
    {
      useClass: HomeRepository,
      provide: IHomeRepository,
    },
    GetFieldUseCase,
    GetListSubjectUseCase,
    GetListLessonUseCase,
    GetListQuestionUseCase,
    LoggingActionUseCase,
  ],
})
export class HomeModule {}

export const homeModuleContainer = getModuleContainer(HomeModule);
