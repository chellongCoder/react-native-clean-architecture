import {createContext} from 'react';
import {TextToSpeechT} from '../../@types/TextToSpeechT';

export const TextToSpeechContext = createContext<Partial<TextToSpeechT>>({});

TextToSpeechContext.displayName = 'TextToSpeechContext';
