import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Image,
  TouchableOpacity,
} from 'react-native';
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
  arraysEqualWithExactItem,
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
import {useLessonStore} from '../../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../../hooks/useSettingLesson';
import {useIsFocused} from '@react-navigation/native';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {observer} from 'mobx-react';
import {LessonRef} from '../../../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {SelectionAnswersQuestionRef} from '../../../components/SelectionAnswersQuestion';
import TextHighlight from '../../../components/TextHighlight';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../../components/VoiceButton';
import useStateCustom from 'src/hooks/useStateCommon';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string, isCorrectAnswer?: boolean) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
  backgroundImage?: string;
  characterImageSuccess?: string;
  characterImageFail?: string;
  characterStyle?: StyleProp<ViewStyle>;
  isMultiQuestion?: boolean;
};

type TMultiQuestionAnswerSelected = {
  questionIndex?: number;
  answerSelected?: string[];
  answerHasSelected?: string[];
  correctImage?: null | string;
};

const Science_SelectAnswer_AnswerImage_MultipleQuestion = observer(
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
      const [multiQuestionAnswerSelected, setMultiQuestionAnswerSelected] =
        useStateCustom<TMultiQuestionAnswerSelected>({
          questionIndex: 0,
          answerSelected: [],
          answerHasSelected: [],
          correctImage: firstMiniTestTask?.question?.[moduleIndex].image as string,
        });

      const {trainingCount, getSetting} = useLessonStore();
      const {selectedChild} = useAuthenticationStore();

      const isCorrectAnswer = useMemo(() => {
        const answerHasSelectedArray =
          multiQuestionAnswerSelected.answerSelected ?? [];

        for (const element of firstMiniTestTask?.question?.[moduleIndex].correctAnswer as string[][]) {
          const check = arraysEqualWithExactItem(element, answerHasSelectedArray);
          if (check) {
            return true;
          }
        }
        return false;
      }, [
        firstMiniTestTask?.question,
        moduleIndex,
        multiQuestionAnswerSelected.answerSelected,
      ]);
   
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
          nextModule((answerSelected as string[], isCorrectAnswer).toString());
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

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex]?.instruction
            ?.description ??
            settings.prompt?.toString() ??
            '',
        );
      }, [firstMiniTestTask?.question, moduleIndex, settings.prompt, ttsSpeak]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);

      const onSelectAnswer = (item: string) => {
        setMultiQuestionAnswerSelected({
          answerSelected: [
            ...(multiQuestionAnswerSelected.answerSelected ?? []),
            item,
          ],
        });
      };

      
      const onMultiQuestionSubmit = useCallback(() => {
        submit();
      }, [
        submit,
      ]);

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

      const rows = [
        firstMiniTestTask?.question?.[moduleIndex].answers.slice(0, 3),
        firstMiniTestTask?.question?.[moduleIndex].answers.slice(3, 6),
      ];

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
            <Animated.View
              style={[animatedStyle, styles.wrapQuestionContainer]}>
              <View
                style={[
                  styles.center,
                  {
                    gap: scale(16),
                  },
                ]}>
                <View style={[styles.flexRow, styles.center, {gap: scale(16)}]}>
                  <View style={styles.questionContainer}>
                    {Array.isArray(
                      multiQuestionAnswerSelected?.answerSelected,
                    ) &&
                      multiQuestionAnswerSelected.answerSelected.length > 0 && (
                        <Image
                          source={{
                            uri:
                              env.IMAGE_QUESTION_BASE_API_URL +
                              (
                                firstMiniTestTask?.question?.[moduleIndex]
                                  .answers as string[]
                              ).find(
                                item =>
                                  item ===
                                  multiQuestionAnswerSelected
                                    .answerSelected?.[0],
                              ),
                          }}
                          style={[
                            styles.wrapAnswerItemImage,
                            {borderRadius: verticalScale(20)},
                          ]}
                        />
                      )}
                  </View>
                  <Text style={styles.plusTitle}>+</Text>
                  <View style={styles.questionContainer}>
                    {Array.isArray(
                      multiQuestionAnswerSelected?.answerSelected,
                    ) &&
                      multiQuestionAnswerSelected.answerSelected.length > 1 && (
                        <Image
                          source={{
                            uri:
                              env.IMAGE_QUESTION_BASE_API_URL +
                              (
                                firstMiniTestTask?.question?.[moduleIndex]
                                  .answers as string[]
                              ).find(
                                item =>
                                  item
                                  .includes(multiQuestionAnswerSelected
                                    .answerSelected?.[1] ?? ''),
                              ),
                          }}
                          style={[
                            styles.wrapAnswerItemImage,
                            {borderRadius: 20},
                          ]}
                        />
                      )}
                  </View>
                </View>
                <View
                  style={[styles.questionContainer, {height: 118, width: 118}]}>
                  {multiQuestionAnswerSelected.correctImage && (
                    <Image
                      source={{
                        uri:
                          env.IMAGE_QUESTION_BASE_API_URL +
                          multiQuestionAnswerSelected.correctImage,
                      }}
                      style={[styles.wrapAnswerItemImage, {borderRadius: 20}]}
                    />
                  )}
                </View>
              </View>
            </Animated.View>
          }
          buildAnswer={
            <View style={styles.fill}>
              <View style={styles.wrapHeaderContainer}>
                <View style={[styles.fill]}>
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

              <View style={[styles.fill, styles.wrapAnswerContainer]}>
                <TextHighlight
                  content={
                    firstMiniTestTask?.question?.[moduleIndex].highlight ?? ''
                  }
                  description={
                    firstMiniTestTask?.question?.[moduleIndex].description ?? ''
                  }
                  style={[
                    {fontSize: scale(20)},
                  ]}
                />
                <View style={[styles.fill, {gap: 8, marginTop: 16}]}>
                  {rows.map((row, rowIndex) => (
                    <View
                      key={rowIndex}
                      style={[styles.fill, styles.flexRow, {gap: 8}]}>
                      {row &&
                        Array.isArray(row) &&
                        row.map((item, index) => {
                          const isSelected =
                            multiQuestionAnswerSelected.answerSelected?.includes(
                              item as string,
                            );
                          return isSelected ? (
                            <View
                              style={[
                                styles.wrapAnswerItemContainer,
                                {
                                  backgroundColor: COLORS.GREEN_66C270,
                                  borderColor: COLORS.GREEN_66C270,
                                },
                              ]}
                            />
                          ) : (
                            <TouchableOpacity
                              key={index}
                              style={[styles.wrapAnswerItemContainer]}
                              onPress={() => onSelectAnswer(item as string)}>
                              <Image
                                source={{
                                  uri: env.IMAGE_QUESTION_BASE_API_URL + item,
                                }}
                                style={styles.wrapAnswerItemImage}
                              />
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  ))}
                </View>
              </View>

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: settings.backgroundButtonColor},
                ]}
                onPress={onMultiQuestionSubmit}
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

export default Science_SelectAnswer_AnswerImage_MultipleQuestion;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
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
  wrapQuestionContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  questionContainer: {
    height: 96,
    width: 96,
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: 20,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: COLORS.GREEN_66C270,
  },
  plusTitle: {
    fontSize: 40,
    color: COLORS.GREEN_66C270,
    fontFamily: FontFamily.SVNCherishMoment,
  },
  wrapAnswerContainer: {
    borderRadius: 30,
    backgroundColor: COLORS.WHITE_FBF8CC,
    padding: 16,
  },
  headerAnswerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: FontFamily.SVNNeuzeitRegular,
    color: COLORS.BLUE_258F78,
  },
  wrapAnswerBodyContainer: {
    flex: 1,
  },
  wrapAnswerItemContainer: {
    borderRadius: 10,
    borderWidth: 4,
    borderColor: COLORS.YELLOW_F2B559,
    width: '32%',
    height: '100%',
  },
  wrapAnswerItemImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
