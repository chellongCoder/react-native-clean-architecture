import {useCallback} from 'react';
import {TLanguageMap, useSpeechToText} from './useSpeechToText';

type Props = {
  correctAnswer?: string;
};
export const usePronunciation = ({correctAnswer}: Props) => {
  const {
    startRecording,
    onResultPress,
    speechResult,
    clearSpeechResult,
    errorSpeech,
    setErrorSpeech,
    loading: loadingRecord,
    checkEmpty,
  } = useSpeechToText(correctAnswer);

  // * start record
  const startRecord = useCallback(
    async (language: keyof TLanguageMap) => {
      console.log('start record');
      // Pass a key in list language. Ex: await startRecording('china');
      await startRecording(language);
    },
    [startRecording],
  );

  // * stop record
  const stopRecord = useCallback(async () => {
    console.log('stop record');
    await onResultPress();
  }, [onResultPress]);

  return {
    startRecord,
    stopRecord,
    speechResult,
    clearSpeechResult,
    errorSpeech,
    setErrorSpeech,
    loadingRecord,
    checkEmpty,
  };
};
