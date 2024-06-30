import {FieldData} from 'src/home/application/types/GetFieldResponse';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';

type HomeStoreState = {
  field: FieldData;
  listSubject: Subject[];
};

export default HomeStoreState;
