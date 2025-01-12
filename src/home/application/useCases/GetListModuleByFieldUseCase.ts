import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {IHomeRepository} from 'src/home/domain/IHomeRepository';
import GetListLessonResponse from '../types/GetListLessonResponse';
import {GetListSubjectPayload} from '../types/GetListSubjectPayload';

@injectable()
export default class GetListModuleByFieldUseCase
  implements UseCase<GetListSubjectPayload, Promise<GetListLessonResponse>>
{
  constructor(
    @provided(IHomeRepository)
    private readonly homeRepository: IHomeRepository,
  ) {}

  public execute(field: GetListSubjectPayload): Promise<GetListLessonResponse> {
    return this.homeRepository.getListLessonByField(field);
  }
}
