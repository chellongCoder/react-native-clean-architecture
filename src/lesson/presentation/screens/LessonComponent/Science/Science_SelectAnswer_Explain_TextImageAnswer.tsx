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
import LessonComponent from '../LessonComponent';
import PrimaryButton from '../../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import {COLORS} from 'src/core/presentation/constants/colors';
import {
  darkenColor,
  getCorrectAnswer,
  isMMSS,
  isSubArray,
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
import {useLessonStore} from '../../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../../hooks/useSettingLesson';
import {useIsFocused} from '@react-navigation/native';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {observer} from 'mobx-react';
import {LessonRef} from '../../../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {SelectionAnswersQuestionRef} from '../../../components/SelectionAnswersQuestion';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../../components/VoiceButton';
import FastImage from 'react-native-fast-image';
import ExplainImage from '../../../components/Science/ExplainImage';
import SelectionAnswersImage from '../../../components/SelectionAnswersImage';
import TextHighlight from '../../../components/TextHighlight';
import TextShadow from '../../../components/TextShadow';

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
  contentContainerStyle?: StyleProp<ViewStyle>;
  hasTitle?: boolean;
};

const Science_SelectAnswer_Explain_TextImageAnswer = observer(
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
      console.log(
        '🛠 LOG: 🚀 --> ------------------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log('🛠 LOG: 🚀 --> ~ answerSelected:', answerSelected);
      console.log(
        '🛠 LOG: 🚀 --> ------------------------------------------------🛠 LOG: 🚀 -->',
      );

      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

      const isCorrectAnswer = useMemo(() => {
        const correctAnswer =
          firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer;
        const answerSelectedArray = (
          Array.isArray(answerSelected) ? answerSelected : [answerSelected]
        ).map(e => e?.toLocaleString().toLocaleLowerCase());
        const correctAnswerArray = (
          Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]
        ).map(e => e?.toLocaleString().toLocaleLowerCase());
        return isSubArray(answerSelectedArray, correctAnswerArray);
      }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

      const [isLearning, setIsLearning] = useState(true);

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
        isCorrectAnswer: isCorrectAnswer,
        onSubmit: () => {
          setAnswerSelected('');
          nextModule((answerSelected as string[]).toString());
          answerRef.current?.resetAnswerSelected?.();
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 60 * 5,
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

      const onSpeechText = useCallback(
        (callback?: () => void) => {
          ttsSpeak?.(
            firstMiniTestTask?.question?.[moduleIndex]?.instruction
              ?.description ??
              settings.prompt?.toString() ??
              '',
            callback,
          );
        },
        [firstMiniTestTask?.question, moduleIndex, settings.prompt, ttsSpeak],
      );

      const handleSubmit = useCallback(() => {
        setIsLearning(e => {
          if (!e) {
            submit();
          }
          return !e;
        });
      }, [submit]);

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
            onSpeechText(() => {
              onSpeechText();
            });
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
          characterStyle={characterStyle}
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
          buildQuestion={
            <Animated.View style={[animatedStyle, {flex: 1}]}>
              {firstMiniTestTask?.question?.[moduleIndex]?.highlight && (
                <TextShadow
                  textShadowColor={settings.backgroundColor}
                  style={[
                    [
                      styles.description,
                      {color: settings.backgroundButtonColor},
                    ],
                  ]}>
                  {firstMiniTestTask?.question?.[moduleIndex]?.highlight}
                </TextShadow>
              )}
              <View style={styles.imageContainer}>
                <FastImage
                  source={{
                    uri:
                      env.IMAGE_QUESTION_BASE_API_URL +
                      firstMiniTestTask?.question?.[moduleIndex].image,
                  }}
                  style={[styles.image]}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
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
                    {i18n.t('lesson.screens.Modules.chooseCorrectAnswer')}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>

              {!isLearning ? (
                <SelectionAnswersImage
                  question={
                    <TextHighlight
                      content={
                        firstMiniTestTask?.question?.[moduleIndex].highlight ??
                        ''
                      }
                      description={
                        firstMiniTestTask?.question?.[
                          moduleIndex
                        ].content.toLocaleLowerCase() ?? ''
                      }
                    />
                  }
                  answer={
                    (
                      firstMiniTestTask?.question?.[moduleIndex]
                        ?.answers as string[]
                    ).map(q => q) ?? []
                  }
                  questionImage={
                    (
                      firstMiniTestTask?.question?.[moduleIndex]
                        ?.answers as string[]
                    ).map(
                      _ =>
                        env.IMAGE_QUESTION_BASE_API_URL +
                        firstMiniTestTask?.question?.[moduleIndex]
                          ?.answerImage?.[0],
                    ) ?? []
                  }
                  answerStyle={styles.fonts_SVN_Cherish}
                  isShowCorrectContainer={isShowCorrectContainer}
                  isAnswerCorrect={!!isAnswerCorrect}
                  onSelectAnswer={(e: string[]) => {
                    setAnswerSelected(e);
                  }}
                  isSelectOne
                  learningTimer={learningTimer}
                  ref={answerRef}
                />
              ) : (
                <ExplainImage
                  title={
                    firstMiniTestTask?.question?.[
                      moduleIndex
                    ]?.description?.split('/')?.[0]
                  }
                  description={
                    firstMiniTestTask?.question?.[
                      moduleIndex
                    ]?.description?.split('/')?.[1]
                  }
                  imageUrl={
                    env.IMAGE_QUESTION_BASE_API_URL +
                    firstMiniTestTask?.question?.[moduleIndex].answerImage?.[0]
                  }
                />
              )}

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: settings.backgroundButtonColor},
                ]}
                onPress={handleSubmit}
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

export default Science_SelectAnswer_Explain_TextImageAnswer;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_SVN_Neuzeit_Bold: {
    fontFamily: FontFamily.SVNNeuzeitBold,
  },
  textQuestion: {
    fontSize: verticalScale(15),
    textAlign: 'left',
    color: COLORS.BLUE_258F78,
  },

  boxSelected: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    height: verticalScale(220),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
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
  txtParagraph: {
    fontFamily: FontFamily.SVNNeuzeitBold,
    fontSize: scale(14),
    color: COLORS.WHITE_FBF8CC,
  },
  image: {
    width: scale(120),
    height: scale(120),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionItem: {},
  descriptionContainer: {
    width: '60%',
  },
  description: {
    fontSize: scale(40),
    fontFamily: FontFamily.SVNCherishMoment,
    textAlign: 'center',
  },
});
