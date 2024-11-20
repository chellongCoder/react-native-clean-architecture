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
import {LoggingActionPayload} from '../application/types/LoggingActionPayload';
import {LoggingActionResponse} from '../application/types/LoggingActionResponse';

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

  /**
   * Retrieves a list of questions for lessons associated with a specific subject.
   *
   * @param {Object} params - The parameters for the request.
   * @param {string} params.subjectId - The unique identifier of the subject for which to retrieve lesson questions.
   * @returns {Promise<GetListQuestionResponse>} A promise that resolves to the response containing the list of questions.
   */
  public async getListLessonQuestions({
    subjectId,
  }: Partial<GetListLessonPayload>): Promise<GetListQuestionResponse> {
    const response: GetListQuestionResponse = await this.httpClient.get(
      `${API_ENDPOINTS.LESSON.QUESTIONS}/${subjectId}`,
    );
    return response;
  }

  public async putLoggingAction({
    userId,
    ...body
  }: Partial<LoggingActionPayload>): Promise<LoggingActionResponse> {
    const response: LoggingActionResponse = await this.httpClient.post(
      `${API_ENDPOINTS.DEFAULT.LOGGING}`,
      {userId: userId ? userId : 'guest', ...body},
    );
    return response;
  }
}

export default HomeRepository;
