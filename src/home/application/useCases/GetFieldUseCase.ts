import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import GetFieldResponse from '../types/GetFieldResponse';
import {IHomeRepository} from 'src/home/domain/IHomeRepository';

@injectable()
export default class GetFieldUseCase
  implements UseCase<any, Promise<GetFieldResponse>>
{
  constructor(
    @provided(IHomeRepository)
    private readonly homeRepository: IHomeRepository,
  ) {}

  public execute(): Promise<GetFieldResponse> {
    return this.homeRepository.getField();
  }
}
