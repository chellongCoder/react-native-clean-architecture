import {createContext} from 'react';
import {TextToSpeechT} from '../../@types/TextToSpeechT';

export const TextToSpeechContext = createContext<TextToSpeechT | null>(null);

TextToSpeechContext.displayName = 'TextToSpeechContext';
