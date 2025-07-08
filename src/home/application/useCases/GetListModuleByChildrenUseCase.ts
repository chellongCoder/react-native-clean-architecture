import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {IHomeRepository} from 'src/home/domain/IHomeRepository';
import GetListLessonResponse from '../types/GetListLessonResponse';
import {GetListModulesChildrenPayload} from '../types/GetListModulesChildrenPayload';

@injectable()
export default class GetListModuleByChildrenUseCase
  implements
    UseCase<GetListModulesChildrenPayload, Promise<GetListLessonResponse>>
{
  constructor(
    @provided(IHomeRepository)
    private readonly homeRepository: IHomeRepository,
  ) {}

  public execute(
    children: GetListModulesChildrenPayload,
  ): Promise<GetListLessonResponse> {
    return this.homeRepository.getListModulesByChildren(children);
  }
}
