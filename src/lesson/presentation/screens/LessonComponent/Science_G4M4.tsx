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
  isSubArray,
} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  Easing,
  ReduceMotion,
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
  characterStyle?: StyleProp<ViewStyle>;
};

const Science_G4M4 = observer(
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

      const {
        isAnswerCorrect,
        isShowCorrectContainer,
        word,
        env,
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
      console.log(
        'firstMiniTestTask?.question?.[moduleIndex]: ',
        firstMiniTestTask?.question?.[moduleIndex],
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
            <View style={styles.questionContainer}>
              <Text style={[styles.fonts_SVN_Cherish, styles.questionText]}>
                {firstMiniTestTask?.question?.[moduleIndex].paragraph}
              </Text>
            </View>
          }
          buildAnswer={
            <View style={styles.fill}>
              <View style={styles.wrapHeaderContainer}>
                <View style={styles.headerTextContainer}>
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

              <View style={styles.answerBoxOuter}>
                <Text
                  style={[styles.fonts_SVN_Neuzeit, styles.answerDescription]}>
                  {firstMiniTestTask?.question?.[moduleIndex].description}
                </Text>
                <View style={styles.answerBoxInnerWrapper}>
                  <View style={styles.answerBoxInnerBorder}>
                    <View style={styles.answerBoxInnerContent}>
                      <TouchableOpacity
                        style={[
                          styles.answerBoxTrue,
                          {
                            backgroundColor:
                              answerSelected === 'true'
                                ? COLORS.GREEN_66C270
                                : COLORS.YELLOW_F2B559,
                          },
                        ]}
                        onPress={() => {
                          setAnswerSelected('true');
                        }}>
                        <Text
                          style={[
                            styles.fonts_SVN_Cherish,
                            styles.answerBoxTrueText,
                          ]}>
                          True
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.answerBoxImageWrapper}>
                        <Image
                          source={{
                            uri:
                              env.IMAGE_QUESTION_BASE_API_URL +
                              firstMiniTestTask?.question?.[moduleIndex].image,
                          }}
                          style={styles.answerBoxImage}
                        />
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.answerBoxFalse,
                          {
                            backgroundColor:
                              answerSelected === 'false'
                                ? COLORS.GREEN_66C270
                                : COLORS.YELLOW_F2B559,
                          },
                        ]}
                        onPress={() => {
                          setAnswerSelected('false');
                        }}>
                        <Text
                          style={[
                            styles.fonts_SVN_Cherish,
                            styles.answerBoxTrueText,
                          ]}>
                          False
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

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

export default Science_G4M4;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_SVN_Neuzeit: {
    fontFamily: FontFamily.SVNNeuzeitRegular,
  },
  questionContainer: {
    marginTop: scale(32),
    paddingHorizontal: scale(48),
  },
  questionText: {
    fontSize: scale(24),
    color: COLORS.CYAN_A5FFEF,
    textAlign: 'center',
  },
  headerTextContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  answerBoxOuter: {
    flex: 1,
    backgroundColor: COLORS.WHITE_FBF8CC,
    padding: scale(16),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerDescription: {
    fontSize: scale(24),
    color: COLORS.BLUE_258F78,
  },
  answerBoxInnerWrapper: {
    flex: 1,
    marginTop: scale(8),
  },
  answerBoxInnerBorder: {
    height: scale(150),
    width: scale(150),
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.YELLOW_F2B559,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerBoxInnerContent: {
    borderRadius: 999,
    height: scale(100),
    width: scale(200),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  answerBoxTrue: {
    height: scale(48),
    width: scale(48),
    borderRadius: 999,
    backgroundColor: COLORS.YELLOW_F2B559,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerBoxTrueText: {
    fontSize: 20,
    color: COLORS.WHITE_FBF8CC,
  },
  answerBoxImageWrapper: {
    height: scale(64),
    width: scale(64),
    borderRadius: 999,
    backgroundColor: COLORS.PURPLE_8F82E8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerBoxImage: {
    height: scale(56),
    width: scale(56),
    borderRadius: 999,
  },
  answerBoxFalse: {
    height: scale(48),
    width: scale(48),
    borderRadius: 999,
    backgroundColor: COLORS.YELLOW_F2B559,
    justifyContent: 'center',
    alignItems: 'center',
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
