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
  isVoicePermissionGranted?: boolean;
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

const initSpeechLanguageCloud: TLanguageMap = {
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
  china: 'cmn-Hans-CN',
  unitedstates: 'en-US',
};

type TLanguageKeys = keyof typeof initSpeechLanguage; // Create a union type of the keys

const getFirstSpeechValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const firstValidValue = value.find(
      item => typeof item === 'string' && item.trim() !== '',
    );

    return typeof firstValidValue === 'string' ? firstValidValue.trim() : '';
  }

  return '';
};

export const useSpeechToText = (fullAnswer?: string) => {
  const [voiceState, setVoiceState] = useStateCustom<TState>({
    recognized: false,
    pitch: '',
    error: undefined,
    end: false,
    started: false,
    results: '',
    partialResults: undefined,
    isListening: false,
    loading: false,
    checkEmpty: false,
    isVoicePermissionGranted: undefined,
  });

  const RECOGNIZER_ENGINE = useRef('GOOGLE').current;

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
      } catch (error: any) {
        console.log('error raised', error);
      }
    },
    [setVoiceState],
  );

  const clearSpeechResult = useCallback(() => {
    setVoiceState({
      results: '',
      partialResults: undefined,
      error: undefined,
    });
  }, [setVoiceState]);

  const onSpeechPartialResults = useCallback(
    (e: any) => {
      // Logs the partial results event to the console for debugging.
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log(
        '🛠 LOG: 🚀 --> ~ onSpeechPartialResults ~ e, refText.current:',
        fullAnswer,
        e,
        refText.current,
      );
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );

      // Checks if the event contains any speech recognition results.
      if (
        !e?.value?.length ||
        e?.value?.every((item: string) => item.trim() === '')
      ) {
        setVoiceState({checkEmpty: true});
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
      setVoiceState({
        time: false,
        results: refText.current,
        checkEmpty: false,
      });
    },
    [fullAnswer, setVoiceState],
  );

  const stopRecording = useCallback(async () => {
    setVoiceState({loading: false});
    try {
      await Voice.stop();
    } catch (error: any) {
      setVoiceState({
        error: {code: error?.code, message: error?.message},
      });
      console.log('error raised', error);
    }
  }, [setVoiceState]);

  const destroyRecording = useCallback(async () => {
    setVoiceState({loading: false});
    try {
      await Voice.destroy();
    } catch (error: any) {
      setVoiceState({
        error: {code: error?.code, message: error?.message},
      });
      console.log('error raised', error);
    }
  }, [setVoiceState]);

  const onResultPress = useCallback(async () => {
    await stopRecording();
  }, [stopRecording]);

  const onSpeechEndHandler = () => {
    setVoiceState({loading: false, error: undefined});
  };

  const onSpeechResultsHandler = useCallback(
    (e: any) => {
      console.log(
        '🛠 LOG: 🚀 --> -----------------------------------------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log(
        '🛠 LOG: 🚀 --> ~ file: useSpeechToText.ts:194 ~ useSpeechToText ~ e:',
        e,
        refText.current,
      );
      console.log(
        '🛠 LOG: 🚀 --> -----------------------------------------------------------------------🛠 LOG: 🚀 -->',
      );

      if (isAndroid) {
        const currentSpeechValue = getFirstSpeechValue(e?.value);

        // Checks if the event contains any speech recognition results.
        if (!currentSpeechValue && !refText.current) {
          setVoiceState({checkEmpty: true});
          return; // Exits the function if there are no results.
        }

        // Updates the reference text with either the matching result or the first result.
        // * nếu ref text chưa có giá trị || ref text có giá trị và giá trị mới khác giá trị cũ
        if (
          !refText.current ||
          (currentSpeechValue && refText.current !== currentSpeechValue)
        ) {
          refText.current = currentSpeechValue; // Sets to the exact match if found.
        }

        // Updates the voice state with the new result and sets `time` to false.
        setVoiceState({
          time: false,
          results: refText.current.trim(),
          checkEmpty: false,
        });
      } else {
        // Logs the final results event to the console for debugging.

        // Checks if the event contains any non-empty speech recognition results.
        if (
          !e?.value?.length ||
          e.value.every((item: string) => item.trim() === '')
        ) {
          return; // Exits the function if there are no meaningful results.
        }

        // Attempts to find a result that matches the `fullAnswer` exactly, ignoring case.
        const speechValues = Array.isArray(e.value) ? e.value : [];
        const approximateResult = speechValues.find(
          (item: string) =>
            item.toLocaleUpperCase() === fullAnswer?.toLocaleUpperCase(),
        );

        // Updates the reference text with either the matching result or the first result.
        if (approximateResult) {
          refText.current = approximateResult; // Sets to the exact match if found.
        } else {
          refText.current = getFirstSpeechValue(speechValues); // Sets to the first result if no exact match is found.
        }

        // Updates the voice state with the new result and sets `time` to false.
        setVoiceState({time: false, results: refText.current});
      }
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

  const requestAudioVoicePermission = useCallback(async () => {
    // First, check if voice recognition is available
    const voiceIsAvailable = await Voice.isAvailable();

    if (!voiceIsAvailable) {
      setVoiceState({isVoicePermissionGranted: undefined});
      return false;
    }

    // Handle Android-specific permissions
    if (Platform.OS === 'android') {
      const atLeastAndroid13 = Platform.Version >= 33;

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

      const isGranted = atLeastAndroid13
        ? grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        : grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED;

      if (!isGranted) {
        console.log('All required permissions not granted');
        setVoiceState({isVoicePermissionGranted: false});
        return false;
      } else {
        console.log('Android permissions granted');
        setVoiceState({isVoicePermissionGranted: true});
        return true;
      }
    }

    // Check voice permission status (for both platforms)
    try {
      const res: TPermissionResponse = await CheckVoicePermission();
      if (res.message === 'success') {
        if (res.result === RESULTS.GRANTED) {
          setVoiceState({isVoicePermissionGranted: true});
          return true;
        } else {
          setVoiceState({isVoicePermissionGranted: false});
          return false;
        }
      } else {
        console.log('Cannot check micro permission!');
        setVoiceState({isVoicePermissionGranted: undefined});
        return false;
      }
    } catch (error) {
      console.log('Error checking voice permission:', error);
      setVoiceState({isVoicePermissionGranted: undefined});
      return false;
    }
  }, [setVoiceState]);

  const setErrorSpeech = useCallback(
    (error: typeof voiceState.error) => {
      setVoiceState({error});
    },
    [setVoiceState, voiceState],
  );

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = _onSpeechError;

    requestAudioVoicePermission();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullAnswer]);

  return {
    voiceState,
    speechResult: voiceState.partialResults || voiceState.results, //speech result
    errorSpeech: voiceState.error,
    setErrorSpeech,
    startRecording, //start speech
    onResultPress, //stop speech + clear previous result
    destroy: destroyRecording,
    clearSpeechResult, //clear result
    loading: voiceState.loading,
    initSpeechLanguage,
    checkEmpty: voiceState.checkEmpty,
  };
};
