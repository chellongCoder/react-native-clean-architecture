export type Answer = string;
export interface Question {
  content: string;
  correctAnswer: string;
  createdAt: string;
  description: string;
  isDeleted: false;
  point: number;
  stt: number;
  taskId: string;
  type: string;
  updatedAt: string;
  _id: string;
  answers: Answer[];
  fullAnswer: string;
}

export interface Task {
  name: string;
  question: Question[];
  stt: number;
  type: 'training' | 'mini_test';
}
export default interface GetListQuestionResponse {
  data: {
    name: string;
    tasks: Task[];
    _id: string;
  };
  error?: {
    code: number;
    message: string;
  };
  message: string;
  status: number;
}
