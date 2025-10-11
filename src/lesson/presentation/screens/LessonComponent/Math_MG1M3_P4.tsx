import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import {isSubArray} from 'src/core/presentation/utils';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {
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
import {SelectionAnswersQuestionRef} from '../../components/SelectionAnswersQuestion';
import KeyboardNumber from '../../components/KeyboardNumber';
import LearningImage from '../../components/LearningImage';
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
  isMulti?: boolean;
  answer?: string[];
};

const Math_MG1M3_P4 = observer(
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
        isMulti,
        answer,
      },
      ref,
    ) => {
      const answerRef = useRef<SelectionAnswersQuestionRef>(null);
      const globalStyle = useGlobalStyle();

      const {ttsSpeak} = useContext(TextToSpeechContext);
      const focus = useIsFocused();

      const [answerSelected, setAnswerSelected] = useState<string[]>([]);
      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

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
        isCorrectAnswer: isSubArray(
          answerSelected as string[],
          firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer as string[],
        ),
        onSubmit: () => {
          setAnswerSelected([]);
          answerRef.current?.resetAnswerSelected?.();
          nextModule((answerSelected as string[]).join(''));
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 50,
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

      const descriptionWithAnswers = useMemo(() => {
        if (answerSelected.length < 2 && answerSelected.length > 0) {
          return [...answerSelected, '?'];
        }
        return answerSelected.length > 0 ? answerSelected : ['?', '?'];
      }, [answerSelected]);

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex]?.instruction
            ?.description ?? '',
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
            firstMiniTestTask?.question?.[moduleIndex]
              ?.correctAnswer as string[],
          );
        },
      }));

      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          module={moduleName}
          lessonName={lessonName}
          part={firstMiniTestTask?.name}
          backgroundColor={settings.backgroundAnswerColor}
          backgroundAnswerColor={settings.backgroundAnswerColor}
          prompt={
            firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
              description: settings.prompt?.toString() ?? '',
            }
          }
          score={selectedChild?.adsPoints}
          txtCountDown={
            word?.toString() ===
            firstMiniTestTask?.question?.[moduleIndex].correctAnswer
              ? undefined
              : word
          }
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <LearningImage
              images={
                answerSelected.length >= 1
                  ? (
                      firstMiniTestTask?.question?.[moduleIndex]
                        .image as string[]
                    ).slice(2, 4) // * check xem đã chọn đáp án chưa, nếu chọn rồi thì hiển thị ảnh đáp án ở vị trí 2,3
                  : (
                      firstMiniTestTask?.question?.[moduleIndex]
                        .image as string[]
                    ).slice(0, 2) // * nếu chưa chọn thì hiển thị ảnh ở vị trí 0,1
              }
              styleContainer={{
                width: scale(150),
                borderWidth: 0,
              }}
            />
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
                    {i18n.t('lesson.screens.Modules.chooseCorrectAnswer')}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>
              <KeyboardNumber
                question={
                  <>
                    {descriptionWithAnswers.map((e, i) => {
                      return (
                        <View key={i} style={styles.wrapAnswerContainer}>
                          <Text
                            style={[
                              styles.fonts_SVN_Cherish,
                              styles.textQuestion,
                              styles.textGreen,
                              styles.mt8,
                              {fontSize: moderateScale(40)},
                            ]}>
                            {e}
                          </Text>
                        </View>
                      );
                    })}
                  </>
                }
                answer={answer ?? []}
                isShowCorrectContainer={isShowCorrectContainer}
                isAnswerCorrect={!!isAnswerCorrect}
                onSelectAnswer={(e: string[]) => {
                  setAnswerSelected(e);
                }}
                learningTimer={learningTimer}
                ref={answerRef}
              />

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: lessonSetting?.backgroundButtonColor},
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

export default Math_MG1M3_P4;

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
    fontSize: moderateScale(20),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
  },
  textGreen: {
    color: COLORS.BLUE_245CC7,
  },
  mt8: {
    marginTop: verticalScale(8),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(24),
    marginTop: verticalScale(16),
    backgroundColor: '#0877B6',
  },
  wrapAnswerContainer: {
    backgroundColor: COLORS.CYAN_A5FFEF,
    borderRadius: 16,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: COLORS.BLUE_2691DE,
    width: scale(67),
    height: verticalScale(58),
    marginRight: scale(4),
  },
});
