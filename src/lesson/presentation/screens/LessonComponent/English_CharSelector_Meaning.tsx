import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
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
  darkenColor,
  getCorrectAnswer,
  isMMSS,
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
import {CharScrambleRep} from '../../components/CharScramble';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';
import WordScramble from '../../components/WordScramble';

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
  characterStyle?: StyleProp<ViewStyle>;
};

const English_CharSelector_Meaning = observer(
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
        characterStyle,
      },
      ref,
    ) => {
      const globalStyle = useGlobalStyle();

      const {ttsSpeak} = useContext(TextToSpeechContext);
      const focus = useIsFocused();
      const answerRef = useRef<SelectionAnswersQuestionRef>(null);

      const [answerSelected, setAnswerSelected] = useState<string | string[]>(
        '',
      );

      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

      const charScrambleRep = useRef<CharScrambleRep>(null);

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
        isCorrectAnswer:
          answerSelected.toString() ===
          (firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer as string),
        onSubmit: () => {
          setAnswerSelected('');
          nextModule((answerSelected as string[]).toString());
          answerRef.current?.resetAnswerSelected?.();
          charScrambleRep.current?.reset?.();
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 60 * 2, // 2 minutes
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
          firstMiniTestTask?.question?.[moduleIndex].fullAnswer
            .toString()
            .toLowerCase() ?? '',
        );
      }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);

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
      }, [onSpeechText, focus]); // Added focus to the dependency array

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
            firstMiniTestTask?.question?.[moduleIndex]?.description ??
            settings.prompt?.toString() ??
            ''
          }
          characterStyle={characterStyle}
          price="Free"
          score={selectedChild?.adsPoints}
          txtCountDown={word && !isMMSS(word) ? undefined : word}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <View style={[styles.containerMeaning]}>
              {learningTimer !== 0 && (
                <Animated.Image
                  resizeMode={'contain'}
                  style={[
                    {
                      width: scale(240),
                      height: verticalScale(100),
                    },
                    animatedStyle,
                  ]}
                  source={{
                    uri:
                      env.IMAGE_QUESTION_BASE_API_URL +
                      firstMiniTestTask?.question?.[moduleIndex].image,
                  }}
                />
              )}
              <Text
                style={[
                  styles.textMeaning,
                  {color: settings.backgroundButtonColor},
                ]}>
                {firstMiniTestTask?.question?.[moduleIndex].description}
              </Text>
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
                  <Text
                    style={[
                      globalStyle.txtLabel,
                      {
                        color: darkenColor(
                          settings.backgroundButtonColor ?? '',
                          20,
                        ),
                      },
                    ]}>
                    {i18n.t('lesson.screens.Modules.chooseTheCorrectAnswer')}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>
              {firstMiniTestTask?.question?.[moduleIndex].answerType ===
              'answer_pick_one' ? (
                <SelectionAnswersQuestion
                  question={
                    <Text
                      style={[
                        styles.textQuestion,
                        styles.textGreen,
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
                    setAnswerSelected(e);
                  }}
                  learningTimer={learningTimer}
                  isSelectOne
                  ref={answerRef}
                />
              ) : (
                <WordScramble
                  ref={charScrambleRep}
                  content={firstMiniTestTask?.question?.[moduleIndex]?.content}
                  listChar={firstMiniTestTask?.question?.[moduleIndex]?.answers}
                  learningTimer={learningTimer}
                  onAnswerChanged={setAnswerSelected}
                  questionStyle={{color: settings.backgroundButtonColor}}
                />
              )}

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

export default English_CharSelector_Meaning;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },

  textQuestion: {
    fontSize: verticalScale(15),
    textAlign: 'left',
    color: COLORS.BLUE_258F78,
  },
  textGreen: {
    color: COLORS.BLUE_258F78,
  },
  containerMeaning: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textMeaning: {
    fontFamily: FontFamily.SVNNeuzeitRegular,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '400',
  },
  textVowel: {
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.YELLOW_F2B559,
    fontSize: verticalScale(28),
  },

  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  iconImageContainer: {
    height: verticalScale(39),
    width: verticalScale(34),
  },
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
});
