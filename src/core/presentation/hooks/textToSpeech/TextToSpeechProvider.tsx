import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {TextToSpeechContext} from './TextToSpeechContext';
import Tts, {Voice} from 'react-native-tts';
import {Platform} from 'react-native';
import {isAndroid} from '../../utils';
import {HomeStore} from 'src/home/presentation/stores/HomeStore';
import {ActionE} from 'src/home/application/types/LoggingActionPayload';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {homeModuleContainer} from 'src/home/HomeModule';

export const iosVoice = [
  {
    id: 'com.apple.speech.synthesis.voice.Trinoids',
    language: 'en-US',
    name: 'Trinoids',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Albert',
    language: 'en-US',
    name: 'Albert',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Hysterical',
    language: 'en-US',
    name: 'Jester',
    quality: 300,
  },
  {
    id: 'com.apple.voice.compact.en-US.Samantha',
    language: 'en-US',
    name: 'Samantha',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Whisper',
    language: 'en-US',
    name: 'Whisper',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Princess',
    language: 'en-US',
    name: 'Superstar',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Bells',
    language: 'en-US',
    name: 'Bells',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Organ',
    language: 'en-US',
    name: 'Organ',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.BadNews',
    language: 'en-US',
    name: 'Bad News',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Bubbles',
    language: 'en-US',
    name: 'Bubbles',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Junior',
    language: 'en-US',
    name: 'Junior',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Bahh',
    language: 'en-US',
    name: 'Bahh',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Deranged',
    language: 'en-US',
    name: 'Wobble',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Boing',
    language: 'en-US',
    name: 'Boing',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.GoodNews',
    language: 'en-US',
    name: 'Good News',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Zarvox',
    language: 'en-US',
    name: 'Zarvox',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Ralph',
    language: 'en-US',
    name: 'Ralph',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Cellos',
    language: 'en-US',
    name: 'Cellos',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Kathy',
    language: 'en-US',
    name: 'Kathy',
    quality: 300,
  },
  {
    id: 'com.apple.speech.synthesis.voice.Fred',
    language: 'en-US',
    name: 'Fred',
    quality: 300,
  },
];

const androidVoice = [
  {
    id: 'en-US-SMTl03',
    language: 'en-US',
    latency: 300,
    name: 'en-US-SMTl03',
    networkConnectionRequired: false,
    notInstalled: false,
    quality: 500,
  },
  {
    id: 'en-US-default',
    language: 'en-US',
    latency: 300,
    name: 'en-US-default',
    networkConnectionRequired: false,
    notInstalled: false,
    quality: 300,
  },
];

type TLanguageList = {
  'Arabic (Saudi Arabia)': string;
  'Bangla (Bangladesh)': string;
  'Bangla (India)': string;
  'Czech (Czech Republic)': string;
  'Danish (Denmark)': string;
  'Austrian German': string;
  'Swiss German': string;
  'Standard German (as spoken in Germany)': string;
  'Modern Greek': string;
  'Australian English': string;
  'Canadian English': string;
  'British English': string;
  'Irish English': string;
  'Indian English': string;
  'New Zealand English': string;
  'US English': string;
  'English (South Africa)': string;
  'Argentine Spanish': string;
  'Chilean Spanish': string;
  'Colombian Spanish': string;
  'Castilian Spanish (as spoken in Central-Northern Spain)': string;
  'Mexican Spanish': string;
  'American Spanish': string;
  'Finnish (Finland)': string;
  'Belgian French': string;
  'Canadian French': string;
  'Swiss French': string;
  'Standard French (especially in France)': string;
  'Hebrew (Israel)': string;
  'Hindi (India)': string;
  'Hungarian (Hungary)': string;
  'Indonesian (Indonesia)': string;
  'Swiss Italian': string;
  'Standard Italian (as spoken in Italy)': string;
  'Japanese (Japan)': string;
  'Korean (Republic of Korea)': string;
  'Belgian Dutch': string;
  'Standard Dutch (as spoken in The Netherlands)': string;
  'Norwegian (Norway)': string;
  'Polish (Poland)': string;
  'Brazilian Portuguese': string;
  'European Portuguese (as written and spoken in Portugal)': string;
  'Romanian (Romania)': string;
  'Russian (Russian Federation)': string;
  'Slovak (Slovakia)': string;
  'Swedish (Sweden)': string;
  'Indian Tamil': string;
  'Sri Lankan Tamil': string;
  'Thai (Thailand)': string;
  'Turkish (Turkey)': string;
  'Mainland China, simplified characters': string;
  'Hong Kong, traditional characters': string;
  'Taiwan, traditional characters': string;
  'Vie (Vietnamese)': string;
};

export const listLanguage: TLanguageList = {
  'Arabic (Saudi Arabia)': 'ar-SA',
  'Bangla (Bangladesh)': 'bn-BD',
  'Bangla (India)': 'bn-IN',
  'Czech (Czech Republic)': 'cs-CZ',
  'Danish (Denmark)': 'da-DK',
  'Austrian German': 'de-AT',
  'Swiss German': 'de-CH',
  'Standard German (as spoken in Germany)': 'de-DE',
  'Modern Greek': 'el-GR',
  'Australian English': 'en-AU',
  'Canadian English': 'en-CA',
  'British English': 'en-GB',
  'Irish English': 'en-IE',
  'Indian English': 'en-IN',
  'New Zealand English': 'en-NZ',
  'US English': 'en-US',
  'English (South Africa)': 'en-ZA',
  'Argentine Spanish': 'es-AR',
  'Chilean Spanish': 'es-CL',
  'Colombian Spanish': 'es-CO',
  'Castilian Spanish (as spoken in Central-Northern Spain)': 'es-ES',
  'Mexican Spanish': 'es-MX',
  'American Spanish': 'es-US',
  'Finnish (Finland)': 'fi-FI',
  'Belgian French': 'fr-BE',
  'Canadian French': 'fr-CA',
  'Swiss French': 'fr-CH',
  'Standard French (especially in France)': 'fr-FR',
  'Hebrew (Israel)': 'he-IL',
  'Hindi (India)': 'hi-IN',
  'Hungarian (Hungary)': 'hu-HU',
  'Indonesian (Indonesia)': 'id-ID',
  'Swiss Italian': 'it-CH',
  'Standard Italian (as spoken in Italy)': 'it-IT',
  'Japanese (Japan)': 'ja-JP',
  'Korean (Republic of Korea)': 'ko-KR',
  'Belgian Dutch': 'nl-BE',
  'Standard Dutch (as spoken in The Netherlands)': 'nl-NL',
  'Norwegian (Norway)': 'no-NO',
  'Polish (Poland)': 'pl-PL',
  'Brazilian Portuguese': 'pt-BR',
  'European Portuguese (as written and spoken in Portugal)': 'pt-PT',
  'Romanian (Romania)': 'ro-RO',
  'Russian (Russian Federation)': 'ru-RU',
  'Slovak (Slovakia)': 'sk-SK',
  'Swedish (Sweden)': 'sv-SE',
  'Indian Tamil': 'ta-IN',
  'Sri Lankan Tamil': 'ta-LK',
  'Thai (Thailand)': 'th-TH',
  'Turkish (Turkey)': 'tr-TR',
  'Mainland China, simplified characters': 'zh-CN',
  'Hong Kong, traditional characters': 'zh-HK',
  'Taiwan, traditional characters': 'zh-TW',
  'Vie (Vietnamese)': 'vi-VN',
};

export type TLanguageKeys = keyof typeof listLanguage; // Create a union type of the keys

export const TextToSpeechProvider = ({children}: PropsWithChildren) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const {selectedChild} = useAuthenticationStore();

  const homeStore = homeModuleContainer.getProvided(HomeStore);
  const [isSpeakDone, setIsSpeakDone] = useState(false);

  const [voices, setVoices] = useState<Voice[]>([]);
  const [onFinish, setOnFinish] = useState<() => void>();

  const ttsSpeak = async (text: string, callback?: () => void) => {
    if (!text || text.trim() === '') {
      console.warn('TTS: Empty text provided');
      return;
    }

    if (isInitialized) {
      try {
        await Tts.stop();
        setOnFinish(callback);
        await Tts.speak(text);
        console.log('TTS speak called successfully');
      } catch (error) {
        console.error('TTS speak error: ', error);
      }
    } else {
      console.warn('TTS not initialized yet.');
    }

    homeStore.putLoggingAction({
      action: ActionE.VIEW_DATA,
      key: 'voices',
      userId: selectedChild?.parentId,
      value: voices,
    });
  };

  const ttsStop = async () => {
    await Tts.stop();
  };

  const updateSpeechRate = async (rate: number) => {
    await Tts.setDefaultRate(rate);
  };

  const updateSpeechPitch = async (rate: number) => {
    await Tts.setDefaultPitch(rate);
  };

  const updateDefaultVoice = async (
    voiceId?: string,
    language?: TLanguageKeys,
  ) => {
    console.log(
      '🛠 LOG: 🚀 --> -----------------------------------------------------------------------------------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log(
      `🛠 LOG: 🚀 --> ~ TextToSpeechProvider ~ voiceId?:,
    language?: TLanguageKeys,:`,
      voiceId,
      language,
    );
    console.log(
      '🛠 LOG: 🚀 --> -----------------------------------------------------------------------------------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    if (language) {
      await Tts.setDefaultLanguage(listLanguage[language])
        .then(res => {
          console.log('voice setDefaultLanguage res: ', res);
        })
        .catch(err => {
          console.log('voice setDefaultLanguage err: ', err);
        });
    }
    if (voiceId) {
      await Tts.setDefaultVoice(voiceId)
        .then(res => {
          console.log('voice setDefaultVoice res: ', res);
        })
        .catch(err => {
          console.log('voice setDefaultVoice err: ', err);
        });
    }
  };

  const init = useCallback(() => {
    console.log('INIT TTS ✅');
    try {
      // Set language
      Tts.setDefaultLanguage(
        Platform.OS === 'android'
          ? androidVoice[0].language
          : iosVoice[0].language,
      );

      // Set voice
      Tts.setDefaultVoice(
        Platform.OS === 'android' ? androidVoice[0].id : iosVoice[3].id,
      );

      // Set speech rate
      Tts.setDefaultRate(isAndroid ? 0.5 : 0.5);

      // Set pitch
      Tts.setDefaultPitch(1.0);

      // Ignore silent switch - allow TTS to play even in silent mode
      Tts.setIgnoreSilentSwitch('ignore');

      setIsInitialized(true);
      console.log('TTS initialized successfully');

      Tts.voices().then(vs => {
        setVoices(vs);
        console.log('Available voices:', vs.length);
      });
    } catch (error) {
      console.error('TTS init error:', error);
    }
  }, []);

  useEffect(() => {
    const initializeTTS = async () => {
      try {
        const status = await Tts.getInitStatus();
        console.log('TTS Status:', status);
        init();
      } catch (error) {
        console.error('TTS initialization error:', error);
        // If there is no TTS engine installed, request to install one
        if ((error as any).code === 'no_engine') {
          console.log('NO TTS ENGINE - Requesting installation');
          Tts.requestInstallEngine();
        }
      }
    };

    initializeTTS();

    // Listen for the 'finish' event
    const finishListener = Tts.addEventListener('tts-finish', event => {
      console.log('TTS Speech completed!', event);
      onFinish?.();
      setIsSpeakDone(true);
    });

    const errorListener =
      Platform.OS === 'android'
        ? Tts.addEventListener('tts-error', event => {
            console.error('TTS Error:', event);
          })
        : null;

    // Cleanup listeners on unmount
    return () => {
      finishListener?.remove?.();
      errorListener?.remove?.();
    };
  }, [init, onFinish]);

  // useEffect(() => {
  //   const setVolume = async () => {
  //     await VolumeManager.setVolume(lesson.charSound);
  //   };
  //   setVolume();
  // }, [lesson.charSound]);

  return (
    <TextToSpeechContext.Provider
      value={{
        ttsSpeak,
        updateSpeechRate,
        updateSpeechPitch,
        updateDefaultVoice,
        voices,
        isSpeakDone,
        init,
        ttsStop,
      }}>
      {children}
    </TextToSpeechContext.Provider>
  );
};
