import {useContext, useEffect} from 'react';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {
  iosVoice,
  listLanguage,
} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechProvider';
import {isAndroid} from 'src/core/presentation/utils';

interface UseSpeakVoiceProps {
  lessonName: string;
}

const useSpeakVoice = ({lessonName}: UseSpeakVoiceProps) => {
  const {updateDefaultVoice, voices} = useContext(TextToSpeechContext);

  useEffect(() => {
    if (lessonName.toLocaleLowerCase().includes('english')) {
      const engVoice = voices?.find(
        voice => voice.language === listLanguage['US English'],
      );
      updateDefaultVoice?.(
        isAndroid ? engVoice?.id : iosVoice[3].id,
        'US English',
      );
    } else if (lessonName.toLocaleLowerCase().includes('mandarin')) {
      const engVoice = voices?.find(
        voice =>
          voice.language ===
          listLanguage['Mainland China, simplified characters'],
      );
      updateDefaultVoice?.(
        engVoice?.id,
        'Mainland China, simplified characters',
      );
    } else if (lessonName.toLocaleLowerCase().includes('vietnamese')) {
      const vietnameseVoices = voices?.filter(
        voice =>
          voice.language.startsWith('vi-') ||
          voice.name.toLowerCase().includes('vietnamese'),
      );

      updateDefaultVoice?.(vietnameseVoices?.[0]?.id, 'Vie (Vietnamese)');
    }
  }, [lessonName, updateDefaultVoice, voices]);
};

export default useSpeakVoice;
