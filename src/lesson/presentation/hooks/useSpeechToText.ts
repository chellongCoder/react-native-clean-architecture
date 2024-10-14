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

export const useSpeechToText = () => {
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

  const startRecording = useCallback(async () => {
    refText.current = '';
    setVoiceState({
      results: '',
      checkEmpty: false,
      loading: true,
      time: true,
      partialResults: undefined,
    });
    try {
      await Voice.start('en-US', {
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 30000, //Extra time to recognize voice when no text change
      });
    } catch (error) {
      console.log('error raised', error);
    }
  }, [setVoiceState]);

  const clearSpeechResult = useCallback(() => {
    setVoiceState({
      results: '',
      partialResults: '',
      error: {},
    });
  }, [setVoiceState]);

  const onSpeechPartialResults = useCallback(
    (e: any) => {
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log('🛠 LOG: 🚀 --> ~ onSpeechPartialResults ~ e:', e);
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );
      setVoiceState({time: false, partialResults: e?.value?.[0]});
    },
    [setVoiceState],
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
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log('🛠 LOG: 🚀 --> ~ onSpeechResultsHandler ~ e:', e);
      console.log(
        '🛠 LOG: 🚀 --> ----------------------------------------🛠 LOG: 🚀 -->',
      );
      refText.current = e?.value?.[0];
      setVoiceState({time: false, results: e?.value?.[0]});
    },
    [setVoiceState],
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
  }, []);

  return {
    voiceState,
    speechResult: voiceState.partialResults || voiceState.results, //speech result
    errorSpeech: voiceState.error,
    startRecording, //start speech
    onResultPress, //stop speech + clear previous result
    clearSpeechResult, //clear result
    handleRecordWithVoice,
  };
};
