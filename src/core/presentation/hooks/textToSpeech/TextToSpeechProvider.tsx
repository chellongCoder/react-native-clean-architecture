import React, {PropsWithChildren, useEffect, useState} from 'react';
import {TextToSpeechContext} from './TextToSpeechContext';
import Tts from 'react-native-tts';
import {Platform} from 'react-native';
import {isAndroid} from '../../utils';
import {VolumeManager} from 'react-native-volume-manager';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';

const iosVoice = [
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

export const TextToSpeechProvider = ({children}: PropsWithChildren) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const lesson = lessonModuleContainer.getProvided(LessonStore);

  const ttsSpeak = async (text: string) => {
    console.log('ttsSpeak: ', text);
    if (isInitialized) {
      await Tts.stop();
      Tts.speak(text);
    } else {
      console.log('TTS not initialized yet.');
    }
  };

  Tts.voices().then(voices => console.log(voices));

  const updateSpeechRate = async (rate: number) => {
    await Tts.setDefaultRate(rate);
  };

  const updateSpeechPitch = async (rate: number) => {
    await Tts.setDefaultPitch(rate);
  };

  const updateDefaultVoice = async (voiceId: number) => {
    await Tts.setDefaultLanguage(iosVoice[voiceId].id);
  };

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        // Tiếng nói
        Tts.setDefaultLanguage(
          Platform.OS === 'android'
            ? androidVoice[0].language
            : iosVoice[0].language,
        );
        // Giọng đọc
        Tts.setDefaultVoice(
          Platform.OS === 'android' ? androidVoice[0].id : iosVoice[3].id,
        );
        // Tốc độ nói
        Tts.setDefaultRate(isAndroid ? 0.5 : 1);

        // Độ ấm của giọng càng thấp giọng càng trầm ấm
        Tts.setDefaultPitch(1.5);

        setIsInitialized(true);
      })
      .catch(error => {
        console.error('TTS initialization failed:', error);
      });
  }, []);

  useEffect(() => {
    const setVolume = async () => {
      await VolumeManager.setVolume(lesson.charSound);
    };
    setVolume();
  }, [lesson.charSound]);

  return (
    <TextToSpeechContext.Provider
      value={{
        ttsSpeak,
        updateSpeechRate,
        updateSpeechPitch,
        updateDefaultVoice,
      }}>
      {children}
    </TextToSpeechContext.Provider>
  );
};
