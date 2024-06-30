import {injectable, provided} from 'inversify-sugar';
import IHttpClient, {
  IHttpClientToken,
} from 'src/core/domain/specifications/IHttpClient';
import {API_ENDPOINTS} from 'src/core/presentation/constants/apiEndpoints';
import {IHomeRepository} from '../domain/IHomeRepository';
import GetFieldResponse from '../application/types/GetFieldResponse';
import {GetListSubjectPayload} from '../application/types/GetListSubjectPayload';
import GetListSubjectResponse from '../application/types/GetListSubjectResponse';

@injectable()
class HomeRepository implements IHomeRepository {
  constructor(
    @provided(IHttpClientToken) private readonly httpClient: IHttpClient,
  ) {}

  public async getField(): Promise<GetFieldResponse> {
    const response: GetFieldResponse = await this.httpClient.get(
      API_ENDPOINTS.FIELD,
    );
    return response;
  }

  public async getListSubject(
    fieldId: GetListSubjectPayload,
  ): Promise<GetListSubjectResponse> {
    const response: GetListSubjectResponse = await this.httpClient.get(
      `${API_ENDPOINTS.SUBJECT.LIST_SUBJECT_OF_FIELD}/${fieldId.fieldId}`,
    );
    return response;
  }
}

export default HomeRepository;
