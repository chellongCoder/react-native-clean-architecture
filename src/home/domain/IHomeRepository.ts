import GetFieldResponse from '../application/types/GetFieldResponse';
import {GetListSubjectPayload} from '../application/types/GetListSubjectPayload';
import GetListSubjectResponse from '../application/types/GetListSubjectResponse';

export const IHomeRepository = Symbol('IHomeRepository');

export interface IHomeRepository {
  getField: () => Promise<GetFieldResponse>;
  getListSubject: (
    fieldId: GetListSubjectPayload,
  ) => Promise<GetListSubjectResponse>;
}
