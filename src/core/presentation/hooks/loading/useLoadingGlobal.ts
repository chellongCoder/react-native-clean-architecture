import {useContextStore} from '../useContextStore';
import {LoadingGlobalContext} from './LoadingGlobalContext';

export const useLoadingGlobal = () => {
  const store = useContextStore(LoadingGlobalContext);

  return store;
};
