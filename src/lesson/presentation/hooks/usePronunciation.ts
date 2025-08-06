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
    destroy,
    errorSpeech,
    setErrorSpeech,
    loading: loadingRecord,
    checkEmpty,
  } = useSpeechToText(correctAnswer);

  // * start record
  const startRecord = useCallback(
    async (language: keyof TLanguageMap) => {
      console.log('start record', language);
      // Pass a key in list language. Ex: await startRecording('china');
      await startRecording(language);
    },
    [startRecording],
  );

  // * start record
  const recordWithLesson = useCallback(
    async (lessonName: string) => {
      if (lessonName.toLocaleLowerCase().includes('english')) {
        startRecord('unitedstates');
      } else if (lessonName.toLocaleLowerCase().includes('mandarin')) {
        startRecord('china');
      } else if (lessonName.toLocaleLowerCase().includes('vietnamese')) {
        startRecord('vietnam');
      }
    },
    [startRecord],
  );

  // * stop record
  const stopRecord = useCallback(async () => {
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
    destroy,
    recordWithLesson,
  };
};
