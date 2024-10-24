import {TLanguageKeys} from '../hooks/textToSpeech/TextToSpeechProvider';

export interface TextToSpeechT {
  ttsSpeak: (e: string) => void;
  updateSpeechRate: (e: number) => void;
  updateSpeechPitch: (e: number) => void;
  updateDefaultVoice: (e?: number, i?: TLanguageKeys) => void;
}
