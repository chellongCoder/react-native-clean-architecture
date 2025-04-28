import {Voice} from 'react-native-tts';
import {TLanguageKeys} from '../hooks/textToSpeech/TextToSpeechProvider';

export interface TextToSpeechT {
  ttsSpeak: (e: string, callback?: () => void) => void;
  updateSpeechRate: (e: number) => void;
  updateSpeechPitch: (e: number) => void;
  updateDefaultVoice: (e?: string, i?: TLanguageKeys) => void;
  voices: Voice[];
  isSpeakDone: boolean;
  init: () => void;
}
