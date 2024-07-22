import {useContextStore} from '../useContextStore';
import {SoundGlobalContext} from './SoundGlobalContext';

export const useSoundGlobal = () => {
  const store = useContextStore(SoundGlobalContext);

  return store;
};
