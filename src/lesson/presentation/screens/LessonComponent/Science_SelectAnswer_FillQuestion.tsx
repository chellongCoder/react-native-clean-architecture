import {StyleSheet, Text, View, ImageBackground} from 'react-native';
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
import {getCorrectAnswer, isMMSS} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
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
import CharScramble, {CharScrambleRep} from '../../components/CharScramble';
import {SoundGlobalContext} from 'src/core/presentation/hooks/sound/SoundGlobalContext';
import TextHighlight from '../../components/TextHighlight';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';

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

const Science_SelectAnswer_FillQuestion = observer(
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

      const focus = useIsFocused();
      const answerRef = useRef<SelectionAnswersQuestionRef>(null);
      const {playSound} = useContext(SoundGlobalContext);
      const {ttsSpeak} = useContext(TextToSpeechContext);

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
          JSON.stringify(answerSelected) ===
          JSON.stringify(
            firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
          ),
        onSubmit: () => {
          setAnswerSelected('');
          nextModule((answerSelected as string[]).toString());
          answerRef.current?.resetAnswerSelected?.();
          charScrambleRep.current?.reset?.();
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
        if (
          firstMiniTestTask?.question?.[moduleIndex]?.instruction?.description
        ) {
          ttsSpeak?.(
            firstMiniTestTask?.question?.[moduleIndex]?.instruction
              ?.description as string,
          );
        }
      }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

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

      const renderFilledParagraph = (paragraph: string, answers: string[]) => {
        let answerIndex = 0;
        // Split by underscores, keeping them in the result
        const parts = paragraph.split(/(_)/g);
        return parts.map((part, idx) => {
          if (part === '_') {
            const answer = answers[answerIndex] || '___';
            answerIndex++;
            return (
              <Text
                key={idx}
                style={{
                  color: COLORS.RED_BC3F0B,
                  fontWeight: 'bold',
                  textDecorationLine: answer !== '___' ? 'underline' : 'none',
                }}>
                {answer}
              </Text>
            );
          }
          return <Text key={idx}>{part}</Text>;
        });
      };

      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          characterStyle={{height: scale(200), marginBottom: scale(-34)}}
          lessonName={lessonName}
          module={moduleName}
          part={firstMiniTestTask?.name}
          backgroundColor="#66c270"
          backgroundAnswerColor={
            settings.backgroundAnswerColor ?? COLORS.GREEN_DDF598
          }
          prompt={settings.prompt?.toString()}
          price="Free"
          score={selectedChild?.adsPoints}
          txtCountDown={word && !isMMSS(word) ? undefined : word}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <ImageBackground
              source={{
                uri:
                  env.IMAGE_QUESTION_BASE_API_URL +
                  firstMiniTestTask?.question?.[moduleIndex].image,
              }}
              resizeMode={'cover'}
              style={{
                width: scale(200),
                height: scale(200),
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: scale(180),
                  paddingBottom: 16,
                }}>
                {firstMiniTestTask?.question?.[moduleIndex].paragraph ? (
                  <Text
                    style={[
                      styles.fonts_SVN_Cherish,
                      {
                        textAlign: 'center',
                        fontSize: scale(14),
                        color: COLORS.RED_BC3F0B,
                        flexWrap: 'wrap',
                      },
                    ]}>
                    {renderFilledParagraph(
                      firstMiniTestTask?.question?.[moduleIndex].paragraph ??
                        '',
                      Array.isArray(answerSelected)
                        ? answerSelected
                        : [answerSelected],
                    )}
                  </Text>
                ) : null}
              </View>
            </ImageBackground>
          }
          buildAnswer={
            <View style={styles.fill}>
              <View style={styles.wrapHeaderContainer}>
                <View style={styles.fill}>
                  <Text style={[globalStyle.txtLabel, styles.textColor]}>
                    {i18n.t('lesson.screens.Modules.fillTheBlank' as any)}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>
              {firstMiniTestTask?.question?.[moduleIndex].answerType ===
              'answer_arrange_word' ? (
                <CharScramble
                  ref={charScrambleRep}
                  content={firstMiniTestTask?.question?.[moduleIndex]?.content}
                  listChar={
                    firstMiniTestTask?.question?.[moduleIndex]
                      ?.answers as string
                  }
                  learningTimer={learningTimer}
                  onAnswerChanged={setAnswerSelected}
                />
              ) : (
                <SelectionAnswersQuestion
                  question={
                    <TextHighlight
                      content={
                        firstMiniTestTask?.question?.[moduleIndex]?.highlight ??
                        ''
                      }
                      description={
                        firstMiniTestTask?.question?.[moduleIndex]?.content ??
                        ''
                      }
                    />
                  }
                  answer={
                    firstMiniTestTask?.question?.[moduleIndex]
                      .answers as unknown as string[]
                  }
                  isShowCorrectContainer={isShowCorrectContainer}
                  isAnswerCorrect={!!isAnswerCorrect}
                  onSelectAnswer={(e: string[]) => {
                    setAnswerSelected(e);
                  }}
                  learningTimer={learningTimer}
                  ref={answerRef}
                  answerStyle={[styles.fonts_SVN_Cherish, {fontSize: 24}]}
                />
              )}

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: settings.backgroundButtonColor},
                ]}
                onPress={submit}
                disable={learningTimer > 0}
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

export default Science_SelectAnswer_FillQuestion;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textColor: {
    color: '#003C82',
  },
  textQuestion: {
    fontSize: verticalScale(15),
    textAlign: 'left',
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
  pb8: {
    paddingBottom: verticalScale(8),
  },
  pb16: {
    paddingBottom: verticalScale(16),
  },
  pb32: {
    paddingBottom: verticalScale(32),
  },
  mt8: {
    marginTop: verticalScale(8),
  },
  mt16: {
    marginTop: verticalScale(16),
  },
  mt24: {
    marginTop: verticalScale(24),
  },
  mt32: {
    marginTop: verticalScale(32),
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
