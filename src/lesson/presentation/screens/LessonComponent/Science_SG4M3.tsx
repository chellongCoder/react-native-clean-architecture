import {StyleSheet, Text, View} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
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
import {
  getCorrectAnswer,
  isMMSS,
  WIDTH_SCREEN,
} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {useIsFocused} from '@react-navigation/native';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {observer} from 'mobx-react';
import {LessonRef} from '../../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import SelectionAnswersQuestion, {
  SelectionAnswersQuestionRef,
} from '../../components/SelectionAnswersQuestion';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
  backgroundImage?: string;
  characterImageSuccess?: string;
  characterImageFail?: string;
};

const Science_SG4M3 = observer(
  forwardRef<LessonRef, Props>(
    (
      {
        moduleIndex,
        nextModule,
        totalModule,
        lessonName,
        moduleName,
        firstMiniTestTask,
        backgroundImage,
        characterImageSuccess,
        characterImageFail,
      },
      ref,
    ) => {
      const globalStyle = useGlobalStyle();

      const {ttsSpeak, isSpeakDone} = useContext(TextToSpeechContext);
      const focus = useIsFocused();
      const answerRef = useRef<SelectionAnswersQuestionRef>(null);

      const [answerSelected, setAnswerSelected] = useState<string>('');

      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

      const isCorrectAnswer = useMemo(() => {
        if (
          typeof firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer ===
          'string'
        ) {
          return (
            answerSelected.toLocaleLowerCase() ===
            getCorrectAnswer(
              firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
            ).toLocaleLowerCase()
          );
        } else if (
          typeof firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer ===
          'object'
        ) {
          return firstMiniTestTask?.question?.[
            moduleIndex
          ]?.correctAnswer?.some((item: string) => {
            return (
              answerSelected.toLocaleLowerCase() === item.toLocaleLowerCase()
            );
          });
        }
        return (
          answerSelected.toLocaleLowerCase() ===
          getCorrectAnswer(
            firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
          ).toLocaleLowerCase()
        );
      }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

      const {
        isAnswerCorrect,
        isShowCorrectContainer,
        word,
        env,
        learningTimer,
        submit,
        toggleShowHint,
        resetLearning,
      } = useSettingLesson({
        countDownTime: trainingCount <= 2 ? 0 : 5,
        isCorrectAnswer: !!isCorrectAnswer,
        onSubmit: () => {
          setAnswerSelected('');
          nextModule(answerSelected.toString());
          answerRef.current?.resetAnswerSelected?.();
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 5 * 60,
      });

      const {lessonSetting} = useHomeStore();

      const i18n = useI18n();

      const settings = useMemo(
        () => getSetting(lessonSetting),
        [getSetting, lessonSetting],
      );
      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex]?.instruction
            ?.description ?? '',
        );
      }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);
      console.log(
        'firstMiniTestTask?.question?.[moduleIndex]: ',
        firstMiniTestTask?.question?.[moduleIndex],
      );
      /**
       * * reset lại countdown khi lần làm thay đổi
       */
      useEffect(() => {
        resetLearning();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [trainingCount]);

      useEffect(() => {
        if (focus) {
          // Check if the component is focused
          const firstTimeout = setTimeout(() => {
            onSpeechText();
          }, 1500);

          return () => clearTimeout(firstTimeout);
        }
      }, [focus, onSpeechText]); // Added focus to the dependency array

      const speakCount = useRef(0);
      useEffect(() => {
        if (focus) {
          // Check if the component is focused
          const firstTimeout = setTimeout(() => {
            if (isSpeakDone && speakCount.current === 0) {
              onSpeechText();
              speakCount.current += 1;
            }
          }, 1500);

          return () => clearTimeout(firstTimeout);
        }
      }, [focus, isSpeakDone, onSpeechText]); // Added focus to the dependency array

      useEffect(() => {
        opacity.value = withTiming(0, {duration: 500}, () => {
          opacity.value = withTiming(1, {duration: 500});
        });
        scaleS.value = withTiming(0, {duration: 500}, () => {
          scaleS.value = withTiming(1, {
            duration: 500,
            easing: Easing.elastic(2),
            reduceMotion: ReduceMotion.System,
          });
        });
      }, [moduleIndex, opacity, scaleS]);

      const animatedStyle = useAnimatedStyle(() => {
        return {
          opacity: opacity.value,
          transform: [{scale: scaleS.value}],
        };
      });

      useImperativeHandle(ref, () => ({
        isAnswerCorrect,
        onChoiceCorrectedAnswer: () => {
          setAnswerSelected(
            getCorrectAnswer(
              firstMiniTestTask?.question?.[moduleIndex]
                ?.correctAnswer as string,
            ),
          );
        },
      }));

      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          lessonName={lessonName}
          module={moduleName}
          part={firstMiniTestTask?.name}
          backgroundColor="#66c270"
          backgroundAnswerColor={
            settings.backgroundAnswerColor ?? COLORS.GREEN_DDF598
          }
          prompt={
            firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
              description: settings.prompt?.toString() ?? '',
            }
          }
          price="Free"
          score={selectedChild?.adsPoints}
          txtCountDown={word && !isMMSS(word) ? undefined : word}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          characterStyle={{
            height: verticalScale(200),
            marginBottom: -verticalScale(80),
            marginLeft: -scale(14),
            transform: [{scale: 1.5}],
          }}
          buildQuestion={
            <View>
              <Animated.Image
                resizeMode={'contain'}
                style={[
                  {
                    width: WIDTH_SCREEN * 0.85,
                    aspectRatio: 1.5,
                  },
                  animatedStyle,
                ]}
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
              <View style={styles.wrapHeaderContainer}>
                <View
                  style={{
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text style={[globalStyle.txtLabel, styles.textColor]}>
                    {i18n.t('lesson.screens.Modules.chooseTheCorrectAnswer')}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>
              <SelectionAnswersQuestion
                question={
                  <Text
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    allowFontScaling
                    style={[
                      styles.textQuestion,
                      styles.textGreen,
                      styles.mt8,
                      {fontSize: scale(24)},
                    ]}>
                    {firstMiniTestTask?.question?.[moduleIndex].content}
                  </Text>
                }
                answer={
                  (firstMiniTestTask?.question?.[moduleIndex]
                    .answers as string[]) ?? []
                }
                isShowCorrectContainer={isShowCorrectContainer}
                isAnswerCorrect={!!isAnswerCorrect}
                onSelectAnswer={(e: string[]) => {
                  setAnswerSelected(e[0]);
                }}
                isSelectOne
                learningTimer={learningTimer}
                fontFamily={FontFamily.SVNCherishMoment}
                ref={answerRef}
              />

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: settings.backgroundButtonColor},
                ]}
                onPress={submit}
              />
            </View>
          }
          moduleIndex={moduleIndex}
          totalModule={totalModule}
        />
      );
    },
  ),
);

export default Science_SG4M3;

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
  textQuestion: {
    fontSize: verticalScale(15),
    textAlign: 'left',
    color: COLORS.BLUE_258F78,
    marginHorizontal: scale(10),
  },
  textGreen: {
    color: '#258F78',
  },
  mt8: {
    marginTop: verticalScale(8),
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  textVowel: {
    fontFamily: FontFamily.SVNCherishMoment,
    color: '#FBF8CC',
    fontSize: verticalScale(28),
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
  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  iconImageContainer: {
    height: verticalScale(45),
    width: verticalScale(40),
  },
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
});
