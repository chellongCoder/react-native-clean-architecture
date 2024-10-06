import {useContextStore} from 'src/core/presentation/hooks/useContextStore';
import {IapContext} from './iapContext';
import {IapContextType} from './types/iapContextType';

export const useIapStore = (): IapContextType => {
  const store = useContextStore(IapContext);
  return store;
};
