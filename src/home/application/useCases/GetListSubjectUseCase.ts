import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {IHomeRepository} from 'src/home/domain/IHomeRepository';
import GetListSubjectResponse from '../types/GetListSubjectResponse';
import {GetListSubjectPayload} from '../types/GetListSubjectPayload';

@injectable()
export default class GetListSubjectUseCase
  implements UseCase<GetListSubjectPayload, Promise<GetListSubjectResponse>>
{
  constructor(
    @provided(IHomeRepository)
    private readonly homeRepository: IHomeRepository,
  ) {}

  public execute(
    fieldId: GetListSubjectPayload,
  ): Promise<GetListSubjectResponse> {
    return this.homeRepository.getListSubject(fieldId);
  }
}
