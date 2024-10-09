import {createContext} from 'react';
import {SpeechToTextStore} from './SpeechToTextStore';

export const SpeechToTextStoreContext = createContext<SpeechToTextStore | null>(
  null,
);

SpeechToTextStoreContext.displayName = 'SpeechToTextStore';
