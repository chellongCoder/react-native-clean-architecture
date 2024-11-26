import GetFieldResponse from '../application/types/GetFieldResponse';
import {GetListLessonPayload} from '../application/types/GetListLessonPayload';
import GetListLessonResponse from '../application/types/GetListLessonResponse';
import GetListQuestionResponse from '../application/types/GetListQuestionResponse';
import {GetListSubjectPayload} from '../application/types/GetListSubjectPayload';
import GetListSubjectResponse from '../application/types/GetListSubjectResponse';
import {LoggingActionPayload} from '../application/types/LoggingActionPayload';
import {LoggingActionResponse} from '../application/types/LoggingActionResponse';

export const IHomeRepository = Symbol('IHomeRepository');

export interface IHomeRepository {
  getField: () => Promise<GetFieldResponse>;
  getListSubject: (
    fieldId: GetListSubjectPayload,
  ) => Promise<GetListSubjectResponse>;
  getListLesson: (
    fieldId: GetListLessonPayload,
  ) => Promise<GetListLessonResponse>;
  getListLessonQuestions: (
    fieldId: Partial<GetListLessonPayload>,
  ) => Promise<GetListQuestionResponse>;
  putLoggingAction: (
    fieldId: Partial<LoggingActionPayload>,
  ) => Promise<LoggingActionResponse>;
}