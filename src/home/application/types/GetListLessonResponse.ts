export interface Module {
  _id: string;
  name: string;
  description: string;
  subjectId: string;
  title: string;
  stt: number;
  totalQuestion: number;
  progressOfChildren: number;
}

export default interface GetListLessonResponse {
  message: string;
  data: Module[];
  error?: {
    code: number;
    message: string;
  };
  status: number;
}
