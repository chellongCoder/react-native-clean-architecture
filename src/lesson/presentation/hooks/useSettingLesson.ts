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

type Props = {
  countDownTime: number;
  fullAnswer?: string;
  isCorrectAnswer?: boolean;
  onSubmit?: () => void;
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

  const submit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      resetLearning();
      resetTesting();

      await onCheckAnswer();
      onSubmit?.();
      playSoundRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onCheckAnswer, onSubmit, resetLearning, resetTesting]);

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
  };
};
