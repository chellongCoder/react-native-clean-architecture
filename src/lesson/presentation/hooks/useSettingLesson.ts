import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useCountDown} from './useCountDown';
import {useIsFocused} from '@react-navigation/native';
import {useTimingQuestion} from './useTimingQuestion';
import {SoundGlobalContext} from 'src/core/presentation/hooks/sound/SoundGlobalContext';
import {soundTrack} from 'src/core/presentation/hooks/sound/SoundGlobalProvider';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {VolumeManager} from 'react-native-volume-manager';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import Toast from 'react-native-toast-message';
import {useSpeechToText} from './useSpeechToText';

type Props = {
  countDownTime: number;
  fullAnswer?: string;
  isCorrectAnswer?: boolean;
  onSubmit?: (speechResult?: string) => void;
};

export const useSettingLesson = ({
  countDownTime,
  fullAnswer,
  isCorrectAnswer,
  onSubmit,
}: Props) => {
  const lessonStore = useLessonStore();
  const authStore = useAuthenticationStore();
  const {playSound} = useContext(SoundGlobalContext);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isShowCorrectContainer, setIsShowCorrectContainer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    start,
    stop,
    reset: resetLearning,
    time: learningTimer,
  } = useCountDown(countDownTime);

  const focus = useIsFocused();

  const {time, reset: resetTesting} = useTimingQuestion(
    focus && learningTimer === 0, // * nếu ở màn này, và đã hết time 5s học thì mới bắt đầu đếm 10s
  );

  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const intervalRef = useRef<NodeJS.Timeout>();

  const playSoundRef = useRef<boolean>(false);

  const {
    startRecording,
    onResultPress,
    speechResult,
    clearSpeechResult,
    errorSpeech,
  } = useSpeechToText();
  console.log(
    '🛠 LOG: 🚀 --> --------------------------------------------🛠 LOG: 🚀 -->',
  );
  console.log('🛠 LOG: 🚀 --> ~ speechResult:', speechResult);
  console.log(
    '🛠 LOG: 🚀 --> --------------------------------------------🛠 LOG: 🚀 -->',
  );

  const word = useMemo(() => {
    if (learningTimer === 0) {
      //* nếu đếm 5 giây xong
      if (time >= 0) {
        // * thì countdown 10 giây để trl
        return `0:${time < 10 ? '0' + time : time}`;
      }
    }
    // * nếu đang ở tgian học thì hiển thị câu trl
    return fullAnswer;
  }, [fullAnswer, learningTimer, time]);

  /**
   * Checks the correctness of the answer and provides feedback.
   *
   * This function evaluates whether the provided answer is correct and triggers appropriate sound feedback.
   * It also manages the visibility of the correct answer container by showing it initially and hiding it after a delay.
   * The function resolves a promise after the feedback delay, which can be used to chain further actions.
   *
   * @remarks
   * - The function uses a Promise to handle asynchronous behavior, allowing actions to be chained after the answer check is complete.
   * - It manipulates UI state (`isShowCorrectContainer` and `isAnswerCorrect`) to provide visual feedback.
   * - Sound feedback is provided using `playSound` with different tracks depending on the answer's correctness.
   * - The function assumes `isCorrectAnswer` is available in the scope to determine the correctness of the answer.
   *
   * @example
   * // To check an answer and handle the result:
   * onCheckAnswer().then(() => {
   *   console.log('Answer checking complete');
   * });
   */
  const onCheckAnswer = useCallback(() => {
    return new Promise(resolve => {
      setIsShowCorrectContainer(true);
      if (isCorrectAnswer) {
        playSound(soundTrack.bell_ding_sound);
        setIsAnswerCorrect(true);
      } else {
        playSound(soundTrack.oh_no_sound);
        setIsAnswerCorrect(false);
      }

      setTimeout(() => {
        setIsShowCorrectContainer(false);
        resolve(true);
      }, 1000);
    });
  }, [isCorrectAnswer, playSound]);

  // * start record
  const startRecord = useCallback(async () => {
    console.log('start record');
    await startRecording();
  }, [startRecording]);

  // * stop record
  const stopRecord = useCallback(async () => {
    console.log('stop record');
    await onResultPress();
  }, [onResultPress]);
  /**
   * Submits the current lesson's answer and handles the submission state.
   *
   * This function orchestrates the submission process for a lesson. It first checks if a submission is already in progress
   * using the `isSubmitting` state. If not, it sets the submission state to true, resets the learning and testing timers,
   * checks the answer, optionally calls a provided `onSubmit` callback, and resets the play sound flag.
   * The submission state is always reset to false upon completion or failure.
   *
   * @remarks
   * - The function is asynchronous and uses several hooks and external functions:
   *   - `resetLearning` and `resetTesting` to reset timers.
   *   - `onCheckAnswer` to validate the answer.
   *   - `onSubmit` callback which might be provided externally.
   * - It ensures that the submission process cannot be triggered multiple times concurrently by checking `isSubmitting`.
   * - The `playSoundRef` is used to manage audio feedback state, ensuring it is reset after submission.
   *
   * @example
   * // To submit an answer:
   * submit();
   */
  const submit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      resetLearning();
      resetTesting();
      stopRecord();
      clearSpeechResult();
      await onCheckAnswer();
      onSubmit?.(speechResult);
      playSoundRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    clearSpeechResult,
    isSubmitting,
    onCheckAnswer,
    onSubmit,
    resetLearning,
    resetTesting,
    speechResult,
    stopRecord,
  ]);

  /**
   * Toggles the hint usage based on the availability of advertisement points.
   *
   * This function checks if the selected child in the authentication store has enough advertisement points to use a hint.
   * If the child has sufficient points, it triggers the hint usage in the lesson store.
   * If not, it displays an informational toast message indicating that there are not enough points to use the hint.
   *
   * @remarks
   * This function relies on the `authStore` for checking the points and `lessonStore` for toggling the hint usage.
   * It is important that the `authStore.selectedChild?.adsPoints` is properly updated elsewhere in the application to ensure correct behavior.
   *
   * @example
   * // To attempt to toggle hint usage:
   * toggleShowHint();
   */
  const toggleShowHint = useCallback(() => {
    if (
      authStore.selectedChild?.adsPoints &&
      authStore.selectedChild?.adsPoints > 0
    ) {
      lessonStore.toggleUseHint();
    } else {
      Toast.show({
        type: 'info',
        text1: 'you do not have enough points to use hint!',
      });
    }
  }, [authStore.selectedChild?.adsPoints, lessonStore]);

  /**
   * bắt đầu start count down 5s
   */
  useEffect(() => {
    if (focus) {
      intervalRef.current = start();
    }

    return () => {
      stop(intervalRef.current!);
    };
  }, [focus, start, stop]);

  /**
   * nếu 5s đếm ngược đã kết thúc -> clear interval 5s
   */
  useEffect(() => {
    if (learningTimer === 0) {
      stop(intervalRef.current!);
    }
  }, [learningTimer, stop]);

  /**
   * nếu 10s đếm ngược đã kết thúc -> submit câu trả lời
   */
  useEffect(() => {
    if (time === 0) {
      submit();
    }
  }, [submit, time]);

  /**
   * nếu chưa play sound đếm ngược 10s & 5s đã kết thúc -> play sound
   */
  useEffect(() => {
    if (!playSoundRef.current && learningTimer === 0) {
      playSound(soundTrack.tiktak);
      playSoundRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningTimer]);

  useAsyncEffect(async () => {
    const currentLevel = await VolumeManager.getVolume();

    VolumeManager.setVolume(Number(lessonStore.charSound));

    return () => {
      VolumeManager.setVolume(parseFloat(currentLevel.volume + ''));
    };
  }, [lessonStore.backgroundSound, lessonStore.charSound]);

  return {
    start,
    stop,
    resetLearning,
    learningTimer,
    focus,
    intervalRef,
    resetTesting,
    word,
    submit,
    isAnswerCorrect,
    isShowCorrectContainer,
    env,
    toggleShowHint,
    isShowHint: lessonStore.isShowHint,
    startRecord,
    stopRecord,
    speechResult,
    errorSpeech,
    clearSpeechResult,
  };
};
