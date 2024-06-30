import {FieldData} from 'src/home/application/types/GetFieldResponse';

export default interface FieldEntities {
  message: string;
  data: FieldData[];
  error?: {
    code: number;
    message: string;
  };
}
