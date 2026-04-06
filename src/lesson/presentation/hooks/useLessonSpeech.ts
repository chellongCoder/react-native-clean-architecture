import {useIsFocused} from '@react-navigation/native';
import {useCallback, useContext, useEffect, useState} from 'react';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';

export const useLessonSpeech = ({text}: {text: string}) => {
  const focus = useIsFocused();
  const {ttsSpeak, ttsStop} = useContext(TextToSpeechContext);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const onSpeechText = useCallback(() => {
    setIsSpeaking(true);
    ttsSpeak?.(text, () => {
      setIsSpeaking(false);
    });
  }, [text, ttsSpeak]);

  useEffect(() => {
    if (focus) {
      const timeout = setTimeout(onSpeechText, 1500);
      return () => {
        clearTimeout(timeout);
        ttsStop?.();
      };
    }
  }, [onSpeechText, focus, ttsStop]);

  return {isSpeaking, onSpeechText};
};
