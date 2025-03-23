import {FieldData} from 'src/home/application/types/GetFieldResponse';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';

type HomeStoreState = {
  field: FieldData;
  listSubject: Subject[];
  subjectId: string;
};

export default HomeStoreState;

export type ModuleItemProps = {
  isFinished: boolean;
  title: string;
  subTitle?: string;
  progress: number;
  totalQuestion: number;
  id: string;
  lessonName?: string;
  image?: string;
};
