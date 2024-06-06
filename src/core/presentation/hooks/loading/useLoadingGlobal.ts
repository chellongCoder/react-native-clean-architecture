import {useEffect} from 'react';
import {useContextStore} from '../useContextStore';
import {LoadingGlobalContext} from './LoadingGlobalContext';

export const useLoadingGlobal = (isLoading: boolean) => {
  const store = useContextStore(LoadingGlobalContext);
  useEffect(() => {
    if (isLoading) {
      store.show();
    } else {
      store.hide();
    }

    return () => {
      store.hide();
    };
  }, [isLoading, store]);
  return store;
};
