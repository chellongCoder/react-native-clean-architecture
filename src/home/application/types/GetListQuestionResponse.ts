export type Answer = {content: string; image: string};
export interface Question {
  content: string;
  highlight: string;
  correctAnswer: string | string[] | string[][];
  createdAt: string;
  description: string;
  answerDescription: string;
  isDeleted: false;
  point: number;
  stt: number;
  taskId: string;
  type: string;
  updatedAt: string;
  _id: string;
  answers: Answer[] | string | string[];
  slide?: Answer[]
  fullAnswer: string;
  image: string | string[];
  answerImage: string[];
  descriptionImage: string | string[];
  answerType: 'answer_pick_one' | 'answer_arrange_word' | 'draw_character';
  paragraph: string;
  pronu_character?: string[];
  instruction: Instruction;
  isAcreage?: boolean;
  color?: string;
  slide?: {content: string, image: string}[]
}

export interface Instruction {
  description: string;
  number?: number;
  content?: string;
}

export interface Task {
  name: string;
  question: Question[];
  stt: number;
  type: 'training' | 'mini_test';
  description: string;
  lessonId: string;
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
  prompt: string[];
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
