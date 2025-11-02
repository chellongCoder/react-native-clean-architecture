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
import {useLessonStore} from '../../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../../hooks/useSettingLesson';
import {useIsFocused} from '@react-navigation/native';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {observer} from 'mobx-react';
import {LessonRef} from '../../../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import SelectionAnswersQuestion, {
  SelectionAnswersQuestionRef,
} from '../../../components/SelectionAnswersQuestion';
import TextHighlight from '../../../components/TextHighlight';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../../components/VoiceButton';
import {useHistoryModule} from './hook';

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

const History_SelectImage_ImageDescription = observer(
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

      const {ttsSpeak, ttsStop} = useContext(TextToSpeechContext);
      const focus = useIsFocused();
      const answerRef = useRef<SelectionAnswersQuestionRef>(null);

      const [answerSelected, setAnswerSelected] = useState<string | string[]>(
        '',
      );

      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

      const isCorrectAnswer = useMemo(() => {
        const correctAnswer = firstMiniTestTask?.question?.[moduleIndex]
          ?.correctAnswer as string[][];
        const answerSelectedArray = (
          Array.isArray(answerSelected) ? answerSelected : [answerSelected]
        ).map(e => e?.toLocaleString().toLocaleLowerCase());
        const correctAnswerArray = (
          Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]
        ).map(e => e?.toLocaleString().toLocaleLowerCase());

        return (
          answerSelectedArray.length === correctAnswerArray.length &&
          isSubArray(answerSelectedArray, correctAnswerArray)
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

      const {onSpeechText} = useHistoryModule({
        text:
          getCorrectAnswer(
            firstMiniTestTask?.question?.[moduleIndex]?.instruction
              ?.description ?? '',
          ) ||
          settings.prompt?.toString() ||
          '',
      });

      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

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
            {
              description: firstMiniTestTask?.question?.[moduleIndex]?.prompt ?? settings.prompt?.toString() ?? '',
            }
          }
          price="Free"
          score={selectedChild?.adsPoints}
          txtCountDown={word && !isMMSS(word) ? undefined : word}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <View
              style={{
                backgroundColor: COLORS.WHITE_FBF8CC,
                marginTop: verticalScale(32),
                borderWidth: 5,
                borderRadius: scale(30),
                // paddingHorizontal: scale(20),
                borderStyle: 'dashed',
                borderColor: COLORS.YELLOW_F2B559,
                height: verticalScale(150),
                width: WIDTH_SCREEN * 0.75,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <Animated.Image
                  resizeMode={'cover'}
                  style={[
                    {
                      width: WIDTH_SCREEN * 0.5,
                      aspectRatio: 1.5,
                      marginTop: -verticalScale(40),
                      borderRadius: scale(30),
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
              <View style={{paddingBottom: verticalScale(12)}}>
                <Text
                  numberOfLines={2}
                  allowFontScaling
                  adjustsFontSizeToFit
                  style={[
                    globalStyle.txtLabel,
                    styles.textTitle,
                    {
                      fontSize: scale(15),
                      color: darkenColor(
                        settings.backgroundButtonColor ?? '',
                        20,
                      ),
                      textAlign: 'center',
                    },
                  ]}>
                  {firstMiniTestTask?.question?.[moduleIndex].description}{' '}
                </Text>
              </View>
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
                    {i18n.t(
                      'lesson.screens.Modules.openSpeakerAndChooseAnswer',
                    )}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>

              <SelectionAnswersQuestion
                question={
                  <TextHighlight
                    content={
                      firstMiniTestTask?.question?.[moduleIndex].highlight ?? ''
                    }
                    description={
                      firstMiniTestTask?.question?.[moduleIndex].content ?? ''
                    }
                  />
                }
                answer={
                  (firstMiniTestTask?.question?.[moduleIndex]
                    .answers as string[]) ?? []
                }
                isSelectOne
                isShowCorrectContainer={isShowCorrectContainer}
                isAnswerCorrect={!!isAnswerCorrect}
                onSelectAnswer={(e: string[]) => {
                  setAnswerSelected(e[0]);
                }}
                learningTimer={learningTimer}
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

export default History_SelectImage_ImageDescription;

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

  textTitle: {
    fontSize: scale(28),
    lineHeight: scale(25),
    fontFamily: FontFamily.SVNCherishMoment,
    letterSpacing: 1.4,
  },
  textDes: {
    fontSize: scale(22),
    lineHeight: scale(26.4),
    fontFamily: FontFamily.SVNNeuzeitBold,
    letterSpacing: -1.1,
  },
  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },

  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
});
