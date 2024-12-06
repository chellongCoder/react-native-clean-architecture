import {IHomeState} from '../HomeProvider';
import {HomeStore} from '../HomeStore';
import {IMergedData} from '../../components/subjects/ListSubject';

export interface HomeContextType {
  homeStore: HomeStore;
  // Add more custom values as needed
  homeState: IHomeState;
  onSelectField: (e?: IMergedData) => void;
  fetchListSubject: (field?: IHomeState['field']) => void;
}
