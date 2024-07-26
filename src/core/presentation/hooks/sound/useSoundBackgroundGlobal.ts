import {useContextStore} from '../useContextStore';
import {SoundBackgroundGlobalContext} from './SoundBackgroundGlobalContext';

export const useSoundBackgroundGlobal = () => {
  const store = useContextStore(SoundBackgroundGlobalContext);

  return store;
};
