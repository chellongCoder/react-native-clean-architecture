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
  image: string;
  descriptionImage: string;
}

export interface Task {
  name: string;
  question: Question[];
  stt: number;
  type: 'training' | 'mini_test';
  description: string;
}
export type LessonSettingT = {
  backgroundButtonColor: string;
  backgroundColor: string;
  backgroundImage: string;
  createdAt: string;
  figureFailImage: string;
  figureSuccessImage: string;
  finishImage: string;
  themeName: string;
  title: string;
};
export default interface GetListQuestionResponse {
  data: {
    name: string;
    tasks: Task[];
    lessonSetting: LessonSettingT;
    _id: string;
  };
  error?: {
    code: number;
    message: string;
  };
  message: string;
  status: number;
}
