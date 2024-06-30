export interface Subject {
  _id: string;
  name: string;
  description: string;
}

export default interface GetListSubjectResponse {
  message: string;
  data: Subject[];
  error?: {
    code: number;
    message: string;
  };
}
