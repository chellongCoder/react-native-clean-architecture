import {IHomeState} from '../HomeProvider';
import {HomeStore} from '../HomeStore';
import {IMergedData} from '../../components/subjects/ListSubject';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';

export interface HomeContextType {
  homeStore: HomeStore;
  // Add more custom values as needed
  homeState: IHomeState;
  onSelectField: (e?: IMergedData) => void;
  fetchListSubject: (
    field?: IHomeState['field'],
  ) => Promise<Subject[] | undefined>;
}
