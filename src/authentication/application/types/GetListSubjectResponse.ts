export interface Subject {
  _id: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  fieldId: string;
}

export default interface GetListSubjectResponse {
  message: string;
  code: number;
  data: Subject[];
  error?: {
    code: number;
    message: string;
  };
}
