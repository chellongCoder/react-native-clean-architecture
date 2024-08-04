import {useContextStore} from '../useContextStore';
import {OfflineContext} from './OfflineContext';

export const useOfflineMode = () => {
  const store = useContextStore(OfflineContext);

  return store;
};
