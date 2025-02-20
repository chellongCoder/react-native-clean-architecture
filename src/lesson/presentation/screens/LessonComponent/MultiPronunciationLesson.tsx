import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import {COLORS} from 'src/core/presentation/constants/colors';
import {
  assets,
  getCorrectAnswer,
  isAndroid,
  isMMSS,
} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  Easing,
  ReduceMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {useIsFocused} from '@react-navigation/native';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {observer} from 'mobx-react';
import * as Haptics from 'expo-haptics';
import {LessonRef} from '../../types';

import {
  iosVoice,
  listLanguage,
} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechProvider';
import {usePronunciation} from '../../hooks/usePronunciation';
import RecordButton from '../../components/RecordButton';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {ActionE} from 'src/home/application/types/LoggingActionPayload';
import {homeModuleContainer} from 'src/home/HomeModule';
import {HomeStore} from 'src/home/presentation/stores/HomeStore';

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

/**
 * PronunciationLesson is a React functional component wrapped with MobX's observer and React's forwardRef.
 * It represents a pronunciation lesson screen in a React Native application.
 *
 * @component
 * @param {Props} props - The properties passed to the component.
 * @param {number} props.moduleIndex - The index of the current module.
 * @param {function} props.nextModule - Function to call to proceed to the next module.
 * @param {number} props.totalModule - The total number of modules.
 * @param {string} props.lessonName - The name of the lesson.
 * @param {string} props.moduleName - The name of the module.
 * @param {object} props.firstMiniTestTask - The first mini test task object.
 * @param {string} props.firstMiniTestTask.name - The name of the mini test task.
 * @param {object[]} props.firstMiniTestTask.question - The array of questions in the mini test task.
 * @param {string} props.firstMiniTestTask.question[].correctAnswer - The correct answer for the question.
 * @param {string} props.firstMiniTestTask.question[].fullAnswer - The full answer for the question.
 * @param {string} props.firstMiniTestTask.question[].descriptionImage - The description image for the question.
 * @param {string} props.firstMiniTestTask.question[].image - The image for the question.
 * @param {string} props.backgroundImage - The background image for the lesson.
 * @param {string} props.characterImageSuccess - The character image to display on success.
 * @param {string} props.characterImageFail - The character image to display on failure.
 * @param {React.Ref<LessonRef>} ref - The reference to the lesson component.
 *
 * @returns {JSX.Element} The rendered PronunciationLesson component.
 *
 * @example
 * <PronunciationLesson
 *   moduleIndex={0}
 *   nextModule={handleNextModule}
 *   totalModule={5}
 *   lessonName="English Pronunciation"
 *   moduleName="Module 1"
 *   firstMiniTestTask={miniTestTask}
 *   backgroundImage="path/to/background.png"
 *   characterImageSuccess="path/to/success.png"
 *   characterImageFail="path/to/fail.png"
 * />
 */
const MultiPronunciationLesson = observer(
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

      const {ttsSpeak, updateDefaultVoice, voices} =
        useContext(TextToSpeechContext);
      const focus = useIsFocused();

      const [answerSelected, setAnswerSelected] = useState('');

      const [isDisabledRecord, setIsDisabledRecord] = useState(false);

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
          let check = true;
          const correctItem =
            firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer?.[0];
          if (
            answerSelected?.split(' ')?.[0]?.toLocaleLowerCase() ===
            correctItem?.toLocaleLowerCase()
          ) {
            check = true;
          } else {
            check = false;
          }
          return check;
        }
        return (
          answerSelected.toLocaleLowerCase() ===
          getCorrectAnswer(
            firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
          ).toLocaleLowerCase()
        );
      }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

      const {trainingCount, getSetting} = useLessonStore();

      const homeStore = homeModuleContainer.getProvided(HomeStore);

      const {selectedChild} = useAuthenticationStore();

      const {
        isAnswerCorrect,
        isShowCorrectContainer,
        word,
        learningTimer,
        submit,
        toggleShowHint,
        resetLearning,
      } = useSettingLesson({
        countDownTime: trainingCount <= 2 ? 0 : 5,
        isCorrectAnswer: !!isCorrectAnswer,
        onSubmit: () => {
          setAnswerSelected('');
          clearSpeechResult();
          nextModule(answerSelected);
          setIsDisabledRecord(false);
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        correctAnswer: getCorrectAnswer(
          firstMiniTestTask?.question?.[moduleIndex].correctAnswer,
        ),
        totalTime: 5 * 60, // * tổng time làm 1câu
      });

      const {
        errorSpeech,
        setErrorSpeech,
        loadingRecord,
        speechResult,
        startRecord: handleStartRecord,
        stopRecord: handleStopRecord,
        destroy: handleDestroyRecord,
        clearSpeechResult,
        checkEmpty,
      } = usePronunciation({
        correctAnswer: getCorrectAnswer(
          firstMiniTestTask?.question?.[moduleIndex].correctAnswer,
        ),
      });

      const {lessonSetting} = useHomeStore();

      const settings = useMemo(
        () => getSetting(lessonSetting),
        [getSetting, lessonSetting],
      );

      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

      const scaleLP = useSharedValue(1);

      const onSpeechText = useCallback(() => {
        const correctAnswers = Array.isArray(
          firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
        )
          ? firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer
          : [firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer];

        correctAnswers.forEach((answer, index) => {
          setTimeout(() => {
            ttsSpeak?.(getCorrectAnswer(answer?.trim()));
          }, index * 750);
        });
      }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);

      const isError = useMemo(() => {
        return errorSpeech || checkEmpty;
      }, [checkEmpty, errorSpeech]);

      /**
       * * nếu có lỗi khi nói thì scale lại button
       */
      useEffect(() => {
        if (isError) {
          scaleLP.value = withSpring(1);
          setIsDisabledRecord(false); // * nếu có câu trả lời trả về thì enable nút

          homeStore.putLoggingAction({
            action: ActionE.VIEW_DATA,
            key: 'error speech',
            userId: selectedChild?.parentId,
            value: errorSpeech || {empty: true},
          });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [checkEmpty, errorSpeech, scaleLP]);
      /**
       * * reset lại countdown khi lần làm thay đổi
       */
      useEffect(() => {
        resetLearning();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [trainingCount]);

      useEffect(() => {
        if (lessonName.toLocaleLowerCase().includes('english')) {
          const engVoice = voices?.find(
            voice => voice.language === listLanguage['US English'],
          );
          updateDefaultVoice?.(
            isAndroid ? engVoice?.id : iosVoice[3].id,
            'US English',
          );
        } else if (lessonName.toLocaleLowerCase().includes('mandarin')) {
          const engVoice = voices?.find(
            voice =>
              voice.language ===
              listLanguage['Mainland China, simplified characters'],
          );
          updateDefaultVoice?.(
            engVoice?.id,
            'Mainland China, simplified characters',
          );
        }
      }, [lessonName, updateDefaultVoice, voices]);

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

      const startRecord = useCallback(() => {
        // Logs the initiation of the recording process to the console.
        console.log('start record');
        Haptics.selectionAsync();
        setErrorSpeech?.(undefined);
        // Checks if there is no ongoing recording process (loadingRecord is false).
        if (!loadingRecord) {
          // Initiates the animation associated with recording. This could involve visual feedback like pulsing or scaling effects.
          console.log(
            '🛠 LOG: 🚀 --> ------------------------------------------------------🛠 LOG: 🚀 -->',
          );
          console.log('🛠 LOG: 🚀 --> ~ startRecord ~ lessonName:', lessonName);
          console.log(
            '🛠 LOG: 🚀 --> ------------------------------------------------------🛠 LOG: 🚀 -->',
          );

          // Calls the handleStartRecord function which likely starts the actual audio recording.
          // This function is expected to handle all the setup necessary for capturing audio input.
          if (lessonName.toLocaleLowerCase().includes('english')) {
            handleStartRecord('unitedstates');
          } else if (lessonName.toLocaleLowerCase().includes('mandarin')) {
            handleStartRecord('china');
          }
        }
      }, [setErrorSpeech, loadingRecord, lessonName, handleStartRecord]);

      const stopRecord = useCallback(() => {
        // Logs the termination of the recording process to the console.
        console.log('handle stop record');

        // Stops any ongoing animations associated with the recording.
        // This could involve stopping visual feedback like pulsing or scaling effects.
        handleStopRecord();
        // Calls the handleStopRecord function which likely stops the actual audio recording.
        // This function is expected to handle all necessary cleanup and finalization of the recording process.
      }, [handleStopRecord]);

      useImperativeHandle(ref, () => ({
        isAnswerCorrect,
        onChoiceCorrectedAnswer: () => {
          setAnswerSelected(
            getCorrectAnswer(
              firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
            ),
          );
        },
      }));

      useEffect(() => {
        if (focus) {
          // Check if the component is focused

          const firstTimeout = setTimeout(() => {
            onSpeechText();

            const secondTimeout = setTimeout(() => {
              onSpeechText();
            }, 2500);

            return () => clearTimeout(secondTimeout);
          }, 1500);

          return () => clearTimeout(firstTimeout);
        }
      }, [onSpeechText, focus]); // Added focus to the dependency array

      useEffect(() => {
        return () => {
          stopRecord();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      // This effect updates the `answerSelected` state whenever `speechResult` changes.
      // `speechResult` is presumably the result from a speech-to-text operation.
      // If `speechResult` is undefined or null, it defaults to an empty string.
      useEffect(() => {
        setAnswerSelected(() => {
          // if (speechResult !== '') {
          //   stopRecord();
          // }
          setIsDisabledRecord(false); // * nếu có câu trả lời trả về thì enable nút
          return speechResult ?? '';
        });
      }, [speechResult, stopRecord]);

      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          lessonName={lessonName}
          module={moduleName}
          part={firstMiniTestTask?.name}
          backgroundColor="#66c270"
          backgroundAnswerColor={settings.backgroundAnswerColor}
          prompt={
            firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
              descrption: settings.prompt?.toString() ?? '',
            }
          }
          price="Free"
          score={selectedChild?.adsPoints}
          txtCountDown={word && !isMMSS(word) ? undefined : word}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <View>
              {(
                firstMiniTestTask?.question?.[moduleIndex].answers as string[]
              )?.map((item, index) => (
                <View
                  style={[
                    styles.wrapTextQuestion,
                    index === 0 && {backgroundColor: COLORS.GREEN_8DE795},
                  ]}
                  key={index}>
                  {item
                    .trim()
                    .split('')
                    .map((char, charIndex) => {
                      const isSpecialChar =
                        char ===
                        firstMiniTestTask?.question?.[moduleIndex]
                          .pronu_character?.[index];

                      return (
                        <Text
                          key={charIndex}
                          style={[
                            styles.fonts_SVN_Cherish,
                            styles.textQuestion,
                            {
                              color: isSpecialChar
                                ? COLORS.RED_BA3201
                                : index === 0
                                ? COLORS.WHITE_FBF8CC
                                : COLORS.GREEN_66C270,
                              textDecorationLine: isSpecialChar
                                ? 'underline'
                                : 'none',
                            },
                          ]}>
                          {char}
                        </Text>
                      );
                    })}
                </View>
              ))}
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
                    Listen and repeat
                  </Text>
                </View>
                <TouchableOpacity onPress={onSpeechText}>
                  <Image
                    source={assets.icon_speech}
                    style={styles.iconAIVoiceContainer}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.boxSelected]}>
                <View
                  style={{
                    height: '50%',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  {answerSelected !== '' &&
                    answerSelected
                      .split(' ') // * nếu correctAnswer là mảng thì check xem correctAnswer đã là chuỗi chưa, nếu chưa thì hiển thị phần tử khác với answerSelected
                      ?.map(voicedAnswer => {
                        return (
                          <View style={styles.wrapCharContainer}>
                            {(
                              firstMiniTestTask?.question?.[moduleIndex]
                                .correctAnswer as string[]
                            )?.find(
                              e =>
                                e.toLocaleLowerCase() ===
                                voicedAnswer.toLocaleLowerCase(),
                            ) ? (
                              <Text
                                style={[
                                  styles.fonts_SVN_Cherish,
                                  styles.textQuestion,
                                  styles.textGreen,
                                ]}>
                                {voicedAnswer}
                              </Text>
                            ) : (
                              <Text
                                style={[
                                  styles.fonts_EinaBold,
                                  styles.textQuestion,
                                  styles.textRed,
                                ]}>
                                {voicedAnswer}
                              </Text>
                            )}
                          </View>
                        );
                      })}
                </View>

                <RecordButton
                  startRecord={startRecord}
                  stopRecord={() => {
                    stopRecord();

                    if (!isError) {
                      // Disable record button after recording to process data
                      setIsDisabledRecord(true);
                    }
                  }}
                  loadingRecord={loadingRecord}
                  disabled={isDisabledRecord}
                  onPress={async () => {
                    console.log('Press record');
                    await handleDestroyRecord();
                    setIsDisabledRecord(false);
                  }}
                  errorSpeech={
                    errorSpeech
                      ? errorSpeech
                      : checkEmpty
                      ? {code: 'EMPTY', message: ''}
                      : undefined
                  }
                />
                <View style={{marginTop: verticalScale(10)}} />
                <View>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={[
                      styles.hintText,
                      isError && {color: COLORS.RED_AF3A1B},
                    ]}>
                    {loadingRecord
                      ? 'Listening...'
                      : isDisabledRecord
                      ? 'Processing voice...'
                      : isError
                      ? 'Please try again'
                      : 'Press n hold to record, release finger after record'}
                  </Text>
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
                        height: '100%',
                      },
                    ]}
                  />
                )}
              </View>

              <PrimaryButton
                text="Submit"
                style={[
                  styles.buttonContainer,
                  {backgroundColor: settings.backgroundButtonColor},
                ]}
                onPress={submit}
                disable={!answerSelected}
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

export default MultiPronunciationLesson;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_EinaBold: {
    fontFamily: FontFamily.SVNNeuzeitBold,
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
    fontSize: 48,
    textAlign: 'center',
    color: COLORS.GREEN_66C270,
  },
  textGreen: {
    color: '#258F78',
  },
  textRed: {
    color: COLORS.RED_E1460E,
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
    marginBottom: 8,
  },
  iconImageContainer: {height: scale(71), width: scale(71)},
  iconAIVoiceContainer: {height: scale(31), width: scale(31)},
  hintText: {
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: COLORS.PRIMARY,
    fontSize: scale(12),
  },
  wrapTextQuestion: {
    paddingVertical: 8,
    paddingHorizontal: 48,
    borderRadius: 30,
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderStyle: 'dashed',
    borderWidth: 4,
    borderColor: COLORS.BLUE_258F78,
    marginBottom: 16,
    flexDirection: 'row',
  },
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
});
