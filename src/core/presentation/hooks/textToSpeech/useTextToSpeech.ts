import {useContextStore} from '../useContextStore';
import {TextToSpeechContext} from './TextToSpeechContext';

export const useTextToSpeech = () => {
  const store = useContextStore(TextToSpeechContext);

  return store;
};
