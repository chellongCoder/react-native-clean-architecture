import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import {COLORS} from 'src/core/presentation/constants/colors';
import {assets, WIDTH_SCREEN} from 'src/core/presentation/utils';
import {useTimingQuestion} from '../../hooks/useTimingQuestion';
import {scale, verticalScale} from 'react-native-size-matters';
import {useCountDown} from '../../hooks/useCountDown';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {SoundGlobalContext} from 'src/core/presentation/hooks/sound/SoundGlobalContext';
import {soundTrack} from 'src/core/presentation/hooks/sound/SoundGlobalProvider';
import {useIsFocused} from '@react-navigation/native';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
};

const VowelsLesson = ({
  moduleIndex,
  nextModule,
  totalModule,
  lessonName,
  moduleName,
  firstMiniTestTask,
}: Props) => {
  const globalStyle = useGlobalStyle();
  const {playSound} = useContext(SoundGlobalContext);

  const [answerSelected, setAnswerSelected] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isShowCorrectContainer, setIsShowCorrectContainer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    start,
    stop,
    reset: resetLearning,
    time: learningTimer,
  } = useCountDown(5);
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService
  const focus = useIsFocused();

  const {time, reset: resetTesting} = useTimingQuestion(learningTimer === 0);

  const intervalRef = useRef<NodeJS.Timeout>();

  const playSoundRef = useRef<boolean>(false);

  const word = useMemo(() => {
    if (learningTimer === 0) {
      if (time >= 0) {
        return `0:${time < 10 ? '0' + time : time}`;
      }
    }
    return firstMiniTestTask?.question?.[moduleIndex]?.fullAnswer;
  }, [firstMiniTestTask?.question, learningTimer, moduleIndex, time]);

  const onCheckAnswer = useCallback(() => {
    return new Promise(resolve => {
      setIsShowCorrectContainer(true);

      if (
        answerSelected ===
        firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer
      ) {
        setIsAnswerCorrect(true);
      } else {
        setIsAnswerCorrect(false);
      }

      setTimeout(() => {
        setIsShowCorrectContainer(false);
        resolve(true);
      }, 1000);
    });
  }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

  const onSubmit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      await onCheckAnswer();

      setAnswerSelected('');
      nextModule(answerSelected);
      resetLearning();
      resetTesting();
      playSoundRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    answerSelected,
    isSubmitting,
    nextModule,
    onCheckAnswer,
    resetLearning,
    resetTesting,
  ]);

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(0, {duration: 500}, () => {
      opacity.value = withTiming(1, {duration: 500});
    });
  }, [moduleIndex, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

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
      onSubmit();
    }
  }, [onSubmit, time]);

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

  return (
    <LessonComponent
      lessonName={lessonName}
      module={moduleName}
      part={firstMiniTestTask?.name}
      backgroundColor="#66c270"
      backgroundAnswerColor="#DDF598"
      price="Free"
      isAnswerCorrect={isAnswerCorrect}
      isShowCorrectContainer={isShowCorrectContainer}
      buildQuestion={
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            {word}
          </Text>
          <Animated.Image
            resizeMode={'contain'}
            width={WIDTH_SCREEN}
            height={scale(200)}
            style={[{}, animatedStyle]}
            source={{
              uri:
                env.IMAGE_QUESTION_BASE_API_URL +
                firstMiniTestTask?.question?.[moduleIndex].image,
            }}
          />
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <Text style={[globalStyle.txtLabel, styles.pb32, styles.textColor]}>
            Choose the correct answer
          </Text>
          <View style={[styles.boxSelected]}>
            <View style={styles.wrapCharContainer}>
              {firstMiniTestTask?.question?.[moduleIndex]?.content
                .split('')
                .map(char => {
                  if (char === '_' && answerSelected) {
                    return (
                      <Text
                        style={[
                          styles.fonts_SVN_Cherish,
                          styles.textQuestion,
                          styles.textGreen,
                          styles.mt16,
                          {textDecorationLine: 'underline'},
                        ]}>
                        {answerSelected}
                      </Text>
                    );
                  }
                  return (
                    <Text
                      style={[
                        styles.fonts_SVN_Cherish,
                        styles.textQuestion,
                        styles.textGreen,
                        styles.mt16,
                      ]}>
                      {char}
                    </Text>
                  );
                })}
            </View>

            <View style={[styles.wapper, styles.fill]}>
              {firstMiniTestTask?.question?.[moduleIndex]?.answers?.map(
                (e, i) => {
                  const bg =
                    e === answerSelected
                      ? !isAnswerCorrect && isShowCorrectContainer
                        ? '#F28759'
                        : '#66C270'
                      : '#F2B559';
                  const length =
                    firstMiniTestTask?.question?.[moduleIndex]?.answers
                      ?.length ?? 2;
                  const size = Math.min((WIDTH_SCREEN - 80) / (length / 2), 56);
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setAnswerSelected(e)}
                      style={[
                        styles.boxVowel,
                        {
                          backgroundColor: bg,
                          height: size,
                          width: size,
                        },
                      ]}>
                      <Text style={[styles.textVowel]}>{e}</Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
            {learningTimer !== 0 && (
              <View
                style={[
                  styles.boxSelected,
                  {
                    position: 'absolute',
                    zIndex: 999,
                    width: '100%',
                    opacity: 0.7,
                  },
                ]}
              />
            )}
          </View>

          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={onSubmit}
          />
        </View>
      }
      moduleIndex={moduleIndex}
      totalModule={totalModule}
    />
  );
};

export default VowelsLesson;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textColor: {
    color: '#1C6349',
  },
  textLarge: {
    fontSize: 140,
    textAlign: 'center',
    color: 'white',
  },
  textQuestion: {
    fontSize: 40,
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
  },
  textGreen: {
    color: '#258F78',
  },
  txtWhite: {
    color: 'white',
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pr16: {
    paddingRight: 16,
  },
  ph24: {
    paddingHorizontal: 24,
  },
  pb16: {
    paddingBottom: 16,
  },
  pb32: {
    paddingBottom: 32,
  },
  mt16: {
    marginTop: 16,
  },
  mt32: {
    marginTop: 32,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxItemAnswer: {
    height: 94,
    backgroundColor: '#F2B559',
    borderRadius: 30,
  },
  boxSelected: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    height: verticalScale(220),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxVowel: {
    width: 56,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 6,
  },
  textVowel: {
    fontFamily: FontFamily.SVNCherishMoment,
    color: '#FBF8CC',
    fontSize: 32,
  },
  wapper: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  wrapCharContainer: {
    flexDirection: 'row',
  },
});
