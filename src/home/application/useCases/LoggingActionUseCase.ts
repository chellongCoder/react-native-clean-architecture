import {injectable, provided} from 'inversify-sugar';
import {UseCase} from 'src/core/application/UseCase';
import {IHomeRepository} from 'src/home/domain/IHomeRepository';
import {LoggingActionPayload} from '../types/LoggingActionPayload';
import {LoggingActionResponse} from '../types/LoggingActionResponse';

@injectable()
export default class LoggingActionUseCase
  implements UseCase<LoggingActionPayload, Promise<LoggingActionResponse>>
{
  constructor(
    @provided(IHomeRepository)
    private readonly homeRepository: IHomeRepository,
  ) {}

  public execute(
    fieldId: LoggingActionPayload,
  ): Promise<LoggingActionResponse> {
    return this.homeRepository.putLoggingAction(fieldId);
  }
}
