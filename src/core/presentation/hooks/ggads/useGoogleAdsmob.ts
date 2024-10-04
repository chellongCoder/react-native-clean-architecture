import {useContextStore} from '../useContextStore';
import {GoogleAdsmobContext} from './GoogleAdsmobContext';

export const useGoogleAdsmob = () => {
  const store = useContextStore(GoogleAdsmobContext);

  return store;
};
