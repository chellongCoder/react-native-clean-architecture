import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
import React, {
  forwardRef,
  useCallback,
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
  arraysEqualWithExactItem,
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
import {useLessonStore} from '../../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../../hooks/useSettingLesson';
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
import Entypo from '@expo/vector-icons/Entypo';
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

const History_SelectAnswer = observer(
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

      const answerRef = useRef<SelectionAnswersQuestionRef>(null);

      const [answerSelected, setAnswerSelected] = useState<string | string[]>(
        '',
      );

      // State to track current slide index
      const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
      const [currentSlideIndexInput, setCurrentSlideIndexInput] =
        useState<string>('1');

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
        return arraysEqualWithExactItem(
          answerSelectedArray,
          correctAnswerArray,
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
      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);

      const {onSpeechText} = useHistoryModule({
        text:
          getCorrectAnswer(
            firstMiniTestTask?.question?.[moduleIndex]?.instruction
              ?.description ?? '',
          ) ||
          settings.prompt?.toString() ||
          '',
      });

      /**
       * * reset lại countdown khi lần làm thay đổi
       */
      useEffect(() => {
        resetLearning();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [trainingCount]);

      // Initialize current slide index based on stt
      useEffect(() => {
        const initialIndex =
          (firstMiniTestTask?.question?.[moduleIndex]?.stt || 1) - 1;
        setCurrentSlideIndex(initialIndex);
      }, [firstMiniTestTask?.question, moduleIndex]);

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

      const onPressChangeImage = useCallback(
        (isNext: boolean) => {
          const slideLength =
            firstMiniTestTask?.question?.[moduleIndex]?.slide?.length || 0;

          if (isNext) {
            // Move to next slide if not at the end
            setCurrentSlideIndex(prev =>
              prev < slideLength - 1 ? prev + 1 : prev,
            );
            setCurrentSlideIndexInput(prev =>
              Number(prev) < slideLength
                ? (Number(prev) + 1).toString()
                : prev.toString(),
            );
          } else {
            // Move to previous slide if not at the beginning
            setCurrentSlideIndex(prev => (prev > 0 ? prev - 1 : prev));
            setCurrentSlideIndexInput(prev =>
              Number(prev) > 0
                ? (Number(prev) - 1).toString()
                : prev.toString(),
            );
          }
        },
        [firstMiniTestTask?.question, moduleIndex],
      );

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
          prompt={{
            description:
              firstMiniTestTask?.question?.[moduleIndex]?.prompt ??
              settings.prompt?.toString() ??
              '',
          }}
          price="Free"
          score={selectedChild?.adsPoints}
          txtCountDown={word && !isMMSS(word) ? undefined : word}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <Animated.View
              style={[
                animatedStyle,
                {
                  height: verticalScale(300),
                  width: '80%',
                  gap: verticalScale(10),
                },
              ]}>
              {/* <Text
                numberOfLines={1}
                allowFontScaling
                adjustsFontSizeToFit
                style={[
                  styles.fonts_SVN_Cherish,
                  {
                    textAlign: 'center',
                    fontSize: scale(20),
                    color: settings.backgroundButtonColor,
                    flexWrap: 'wrap',
                  },
                ]}>
                {firstMiniTestTask?.question?.[moduleIndex]?.description}
              </Text> */}

              {firstMiniTestTask?.question?.[moduleIndex]?.slide?.[
                currentSlideIndex
              ] && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: verticalScale(4),
                  }}>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.fonts_SVN_Neuzeit_Bold,
                      {
                        textAlign: 'center',
                        fontSize: scale(18),
                        color: darkenColor(settings.backgroundColor!, 50),
                      },
                    ]}>
                    {
                      firstMiniTestTask?.question?.[moduleIndex]?.slide[
                        currentSlideIndex
                      ].content
                    }
                  </Text>
                  <Image
                    source={{
                      uri:
                        env.IMAGE_QUESTION_BASE_API_URL +
                        firstMiniTestTask?.question?.[moduleIndex]?.slide[
                          currentSlideIndex
                        ].image,
                    }}
                    style={{
                      height: verticalScale(140),
                      width: scale(210),
                      borderRadius: 22,
                      borderWidth: 3,
                      borderColor: COLORS.WHITE_FBF8CC,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center',
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                    <Entypo
                      name="triangle-left"
                      size={24}
                      color={
                        currentSlideIndex === 0
                          ? COLORS.DISABLED
                          : COLORS.YELLOW_F2B559
                      }
                      onPress={() =>
                        currentSlideIndex > 0 && onPressChangeImage(false)
                      }
                    />
                    <TextInput
                      style={[
                        styles.fonts_SVN_Neuzeit_Bold,
                        {
                          paddingHorizontal: 8,
                          backgroundColor: COLORS.WHITE_FBF8CC,
                          textAlign: 'center',
                          fontSize: 15,
                          color: COLORS.GREEN_258F78,
                        },
                      ]}
                      value={currentSlideIndexInput.toString() || ''}
                      onChangeText={text => {
                        setCurrentSlideIndexInput(text);
                      }}
                      onBlur={() => {
                        Keyboard.dismiss();
                      }}
                      onSubmitEditing={() => {
                        if (currentSlideIndexInput === '0') {
                          setCurrentSlideIndex(0);
                          setCurrentSlideIndexInput('1');
                        } else if (
                          Number(currentSlideIndexInput) >
                          (firstMiniTestTask?.question?.[moduleIndex]?.slide
                            ?.length || 1)
                        ) {
                          setCurrentSlideIndex(
                            (firstMiniTestTask?.question?.[moduleIndex]?.slide
                              ?.length || 1) - 1,
                          );
                          setCurrentSlideIndexInput(
                            (
                              firstMiniTestTask?.question?.[moduleIndex]?.slide
                                ?.length || 1
                            ).toString(),
                          );
                        } else {
                          setCurrentSlideIndex(
                            Number(currentSlideIndexInput) - 1,
                          );
                        }
                      }}
                      returnKeyType="done"
                      blurOnSubmit
                      keyboardType="number-pad"
                    />

                    <Entypo
                      name="triangle-right"
                      size={24}
                      color={
                        currentSlideIndex ===
                        (firstMiniTestTask?.question?.[moduleIndex]?.slide
                          ?.length || 1) -
                          1
                          ? COLORS.DISABLED
                          : COLORS.YELLOW_F2B559
                      }
                      onPress={() =>
                        currentSlideIndex <
                          (firstMiniTestTask?.question?.[moduleIndex]?.slide
                            ?.length || 1) -
                            1 && onPressChangeImage(true)
                      }
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.fonts_SVN_Neuzeit_Bold,
                        {
                          textAlign: 'center',
                          fontSize: 15,
                          color: COLORS.WHITE_FBF8CC,
                        },
                      ]}>
                      {currentSlideIndex + 1}/
                      {firstMiniTestTask?.question?.[moduleIndex]?.slide.length}
                    </Text>
                  </View>
                </View>
              )}
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
                    ?.answers as string[]) ?? []
                }
                isSelectOne
                answerStyle={styles.fonts_SVN_Cherish}
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

export default History_SelectAnswer;

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
  fonts_SVN_Neuzeit: {
    fontFamily: FontFamily.SVNNeuzeitRegular,
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
});
