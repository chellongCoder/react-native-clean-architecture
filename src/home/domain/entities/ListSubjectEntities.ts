import {Subject} from 'src/home/application/types/GetListSubjectResponse';

export default interface ListSubjectEntities {
  message: string;
  data: Subject[];
  error?: {
    code: number;
    message: string;
  };
}
