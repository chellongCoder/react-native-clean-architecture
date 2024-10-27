/* eslint-disable @typescript-eslint/no-empty-function */
import {useCallback, useEffect, useRef} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import useStateCustom from 'src/hooks/useStateCommon';
import Voice from '@react-native-voice/voice';
import {
  CheckVoicePermission,
  isAndroid,
  TPermissionResponse,
} from 'src/core/presentation/utils';
import {RESULTS} from 'react-native-permissions';

type TState = {
  recognized?: boolean;
  pitch?: string;
  error?: {code?: string; message?: string};
  end?: boolean;
  started?: boolean;
  results?: string;
  partialResults?: string;
  isListening?: boolean;
  loading?: boolean;
  time?: boolean;
  checkEmpty?: boolean;
};

export type TLanguageMap = {
  taiwan: string;
  france: string;
  italia: string;
  vietnam: string;
  korean: string;
  canada: string;
  singapore: string;
  india: string;
  newzealand: string;
  yue: string;
  zhcn: string;
  england: string;
  japan: string;
  zhhk: string;
  china: string;
  unitedstates: string;
};

const initSpeechLanguage: TLanguageMap = {
  taiwan: 'zh-TW',
  france: 'fr-FR',
  italia: 'it-IT',
  vietnam: 'vi-VN',
  korean: 'ko-KR',
  canada: 'en-CA',
  singapore: 'en-SG',
  india: 'en-IN',
  newzealand: 'en-NZ',
  yue: 'yue-CN',
  zhcn: 'zh-CN',
  england: 'en-GB',
  japan: 'ja-JP',
  zhhk: 'zh-HK',
  china: 'zh-CN',
  unitedstates: 'en-US',
};

type TLanguageKeys = keyof typeof initSpeechLanguage; // Create a union type of the keys

export const useSpeechToText = (fullAnswer?: string) => {
  const [voiceState, setVoiceState] = useStateCustom<TState>({
    recognized: false,
    pitch: '',
    error: {},
    end: false,
    started: false,
    results: '',
    partialResults: undefined,
    isListening: false,
    loading: false,
    checkEmpty: false,
  });

  const refText = useRef('');

  const onSpeechStartHandler = () => {};

  const onSpeechVolumeChanged = useCallback(() => {}, []);

  const startRecording = useCallback(
    async (language: TLanguageKeys) => {
      console.log(
        '🛠 LOG: 🚀 --> ------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log('🛠 LOG: 🚀 --> ~ language:', language);
      console.log(
        '🛠 LOG: 🚀 --> ------------------------------------🛠 LOG: 🚀 -->',
      );
      refText.current = '';
      setVoiceState({
        results: '',
        checkEmpty: false,
        loading: true,
        time: true,
        partialResults: undefined,
      });
      try {
        await Voice.start(language ? initSpeechLanguage[language] : 'en-US', {
          EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 10000, //Extra time to recognize voice when no text change
        });
      } catch (error) {
        console.log('error raised', error);
      }
    },
    [setVoiceState],
  );

  const clearSpeechResult = useCallback(() => {
    setVoiceState({
      results: '',
      partialResults: '',
      error: {},
    });
  }, [setVoiceState]);

  const onSpeechPartialResults = useCallback(
    (e: any) => {
      // Logs the partial results event to the console for debugging.
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log('🛠 LOG: 🚀 --> ~ onSpeechPartialResults ~ e:', fullAnswer, e);
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );

      // Checks if the event contains any speech recognition results.
      if (
        !e?.value?.length ||
        e?.value?.every((item: string) => item.trim() === '')
      ) {
        return; // Exits the function if there are no results.
      }

      // Attempts to find a result that matches the `fullAnswer` exactly, ignoring case.
      const approximateResult = e?.value?.find(
        (item: string) =>
          item.toLocaleUpperCase() === fullAnswer?.toLocaleUpperCase(),
      );

      // Updates the reference text with either the matching result or the first result.
      if (approximateResult) {
        refText.current = approximateResult; // Sets to the exact match if found.
      } else {
        refText.current = e?.value?.[0]; // Sets to the first result if no exact match is found.
      }

      // Updates the voice state with the new result and sets `time` to false.
      setVoiceState({time: false, results: refText.current});
    },
    [fullAnswer, setVoiceState],
  );

  const stopRecording = useCallback(async () => {
    setVoiceState({loading: false});
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error raised', error);
    }
  }, [setVoiceState]);

  const onResultPress = useCallback(async () => {
    await stopRecording();
  }, [stopRecording]);

  const onSpeechEndHandler = () => {
    setVoiceState({loading: false});
  };

  const onSpeechResultsHandler = useCallback(
    (e: any) => {
      // Logs the final results event to the console for debugging.
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log('🛠 LOG: 🚀 --> ~ onSpeechResultsHandler ~ e:', e);
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );

      // Checks if the event contains any non-empty speech recognition results.
      if (
        !e?.value?.length ||
        e.value.every((item: string) => item.trim() === '')
      ) {
        return; // Exits the function if there are no meaningful results.
      }

      // Attempts to find a result that matches the `fullAnswer` exactly, ignoring case.
      const approximateResult = e.value.find(
        (item: string) =>
          item.toLocaleUpperCase() === fullAnswer?.toLocaleUpperCase(),
      );

      // Updates the reference text with either the matching result or the first result.
      if (approximateResult) {
        refText.current = approximateResult; // Sets to the exact match if found.
      } else {
        refText.current = e.value[0]; // Sets to the first result if no exact match is found.
      }

      // Updates the voice state with the new result and sets `time` to false.
      setVoiceState({time: false, results: refText.current});
    },
    [fullAnswer, setVoiceState],
  );

  const _onSpeechError = useCallback(
    (e: any) => {
      console.log('_onSpeechError: ', e);
      setVoiceState({error: e});
    },
    [setVoiceState],
  );

  const requestMicrophonePermission = async () => {
    const atLeastAndroid13 =
      Platform.OS === 'android' && Platform.Version >= 33;

    if (Platform.OS === 'android') {
      const grants = await PermissionsAndroid.requestMultiple(
        atLeastAndroid13
          ? [
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
            ]
          : [
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ],
      );
      if (
        atLeastAndroid13
          ? grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
          : grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
              PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissions granted');
        return PermissionsAndroid.RESULTS.GRANTED;
      } else {
        console.log('All required permissions not granted');
        return PermissionsAndroid.RESULTS.BLOCKED;
      }
    } else {
      return PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  const handleRecordWithVoice = useCallback(async () => {
    const voiceIsAvailable = await Voice.isAvailable();
    console.log(
      '🛠 LOG: 🚀 --> ----------------------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log(
      '🛠 LOG: 🚀 --> ~ handleRecordWithVoice ~ voiceIsAvailable:',
      voiceIsAvailable,
    );
    console.log(
      '🛠 LOG: 🚀 --> ----------------------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    // this.setIsFirstTimeOpenTutModal();
    if (voiceIsAvailable) {
      const res: TPermissionResponse = await CheckVoicePermission();
      console.log(
        '🛠 LOG: 🚀 --> --------------------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log('🛠 LOG: 🚀 --> ~ handleRecordWithVoice ~ res:', res);
      console.log(
        '🛠 LOG: 🚀 --> --------------------------------------------------🛠 LOG: 🚀 -->',
      );
      if (res.message === 'success') {
        if (res.result === RESULTS.BLOCKED) {
          // this.onShowVoiceSettingModal();
        } else {
          // onSearch?.();
        }
      } else {
        console.log('Cannot check micro permission!');
      }
    } else {
      if (!isAndroid) {
        // this.onShowVoiceRecognizeModal();
      } else {
        // this.onShowVoiceNotCompatibleModal();
      }
    }
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = _onSpeechError;

    requestMicrophonePermission();

    handleRecordWithVoice();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullAnswer]);

  return {
    voiceState,
    speechResult: voiceState.partialResults || voiceState.results, //speech result
    errorSpeech: voiceState.error,
    startRecording, //start speech
    onResultPress, //stop speech + clear previous result
    clearSpeechResult, //clear result
    handleRecordWithVoice,
    loading: voiceState.loading,
    initSpeechLanguage,
  };
};
