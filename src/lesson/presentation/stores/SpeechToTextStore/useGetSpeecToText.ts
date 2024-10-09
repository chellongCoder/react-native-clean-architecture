import {useContextStore} from 'src/core/presentation/hooks/useContextStore';
import {SpeechToTextStoreContext} from './SpeechToTextStoreContext';
import {SpeechToTextStore} from './SpeechToTextStore';

export const useGetSpeechToText = (): SpeechToTextStore => {
  const store = useContextStore(SpeechToTextStoreContext);

  return store;
};
