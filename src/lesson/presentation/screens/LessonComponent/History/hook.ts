import {useIsFocused} from '@react-navigation/native';
import {useCallback, useContext, useEffect, useState} from 'react';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';

export const useHistoryModule = ({text}: {text: string}) => {
  // Custom hook logic here
  const focus = useIsFocused();
  const {ttsSpeak, ttsStop} = useContext(TextToSpeechContext);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const onSpeechText = useCallback(() => {
    setIsSpeaking(true);
    ttsSpeak?.(text, () => {
      // Callback after speech ends
      setIsSpeaking(false);
    });
  }, [text, ttsSpeak]);

  useEffect(() => {
    if (focus) {
      // Check if the component is focused
      const firstTimeout = setTimeout(() => {
        onSpeechText();
      }, 1500);

      return () => {
        clearTimeout(firstTimeout);
        ttsStop?.();
      };
    }
  }, [onSpeechText, focus, ttsStop]); // Added focus to the dependency array

  return {isSpeaking, onSpeechText};
};
