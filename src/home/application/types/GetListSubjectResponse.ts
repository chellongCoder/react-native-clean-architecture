export enum TypeSubject {
  CHILD = 'child',
  ROOT = 'root',
}
export interface Subject {
  _id: string;
  name: string;
  description: string;
  type: TypeSubject;
  parentId: string;
  level: number;
  fieldId: string;
  image: string;
}

export default interface GetListSubjectResponse {
  message: string;
  data: Subject[];
  error?: {
    code: number;
    message: string;
  };
}
