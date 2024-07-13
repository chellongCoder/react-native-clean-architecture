import {injectable, provided} from 'inversify-sugar';
import IHttpClient, {
  IHttpClientToken,
} from 'src/core/domain/specifications/IHttpClient';
import {API_ENDPOINTS} from 'src/core/presentation/constants/apiEndpoints';
import {IHomeRepository} from '../domain/IHomeRepository';
import GetFieldResponse from '../application/types/GetFieldResponse';
import {GetListSubjectPayload} from '../application/types/GetListSubjectPayload';
import GetListSubjectResponse from '../application/types/GetListSubjectResponse';
import {GetListLessonPayload} from '../application/types/GetListLessonPayload';
import GetListLessonResponse from '../application/types/GetListLessonResponse';
import GetListQuestionResponse from '../application/types/GetListQuestionResponse';

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

  public async getListSubject({
    fieldId,
  }: GetListSubjectPayload): Promise<GetListSubjectResponse> {
    const response: GetListSubjectResponse = await this.httpClient.get(
      `${API_ENDPOINTS.SUBJECT.LIST_SUBJECT_OF_FIELD}/${fieldId}`,
    );
    return response;
  }

  public async getListLesson({
    childrenId,
    subjectId,
  }: GetListLessonPayload): Promise<GetListLessonResponse> {
    const response: GetListLessonResponse = await this.httpClient.post(
      `${API_ENDPOINTS.LESSON.LISTLESSONOFSUBJECT}`,
      {childrenId, subjectId},
    );
    return response;
  }

  public async getListLessonQuestions({
    subjectId,
  }: Partial<GetListLessonPayload>): Promise<GetListQuestionResponse> {
    const response: GetListQuestionResponse = await this.httpClient.get(
      `${API_ENDPOINTS.LESSON.QUESTIONS}/${subjectId}`,
    );
    return response;
  }
}

export default HomeRepository;