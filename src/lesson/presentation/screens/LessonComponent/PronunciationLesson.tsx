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
import {assets, isAndroid, WIDTH_SCREEN} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {useIsFocused} from '@react-navigation/native';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {observer} from 'mobx-react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import {LessonRef} from '../../types';
import Tts from 'react-native-tts';
import {
  iosVoice,
  listLanguage,
} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechProvider';

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

const PronunciationLesson = observer(
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

      const {ttsSpeak, updateDefaultVoice} = useContext(TextToSpeechContext);
      const focus = useIsFocused();

      const [answerSelected, setAnswerSelected] = useState('');

      const isCorrectAnswer = useMemo(() => {
        return (
          answerSelected.toLocaleLowerCase() ===
          firstMiniTestTask?.question?.[
            moduleIndex
          ]?.correctAnswer.toLocaleLowerCase()
        );
      }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

      const {trainingCount} = useLessonStore();

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
        startRecord: handleStartRecord,
        stopRecord: handleStopRecord,
        loadingRecord,
        speechResult,
        errorSpeech,
      } = useSettingLesson({
        countDownTime: trainingCount <= 2 ? 0 : 5,
        isCorrectAnswer: !!isCorrectAnswer,
        onSubmit: () => {
          setAnswerSelected('');
          nextModule(answerSelected);
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        correctAnswer: firstMiniTestTask?.question?.[moduleIndex].correctAnswer,
        totalTime: 5 * 60, // * tổng time làm 1câu
      });

      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

      const scaleLP = useSharedValue(1);

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex].correctAnswer
            .toString()
            .toLowerCase() ?? '',
        );
      }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);
      // Inside your component
      const scaleValue = useSharedValue(0.05); // Start from 0.05 times the size to scale from 10 to 200
      const opacityValue = useSharedValue(1); // Start with full opacity

      const animatedCircleStyle = useAnimatedStyle(() => {
        return {
          transform: [{scale: scaleValue.value}],
          opacity: opacityValue.value,
          width: 200, // Fixed width to scale to
          height: 200, // Fixed height to scale to
          borderRadius: 100, // Maintain circular shape
          backgroundColor: COLORS.PRIMARY,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        };
      });

      /**
       * * nếu có lỗi khi nói thì scale lại button
       */
      useEffect(() => {
        if (errorSpeech) {
          scaleLP.value = withSpring(1);
        }
      }, [errorSpeech, scaleLP]);
      /**
       * * reset lại countdown khi lần làm thay đổi
       */
      useEffect(() => {
        resetLearning();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [trainingCount]);

      useEffect(() => {
        console.log(
          '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
        );
        console.log('🛠 LOG: 🚀 --> ~ Tts.voices ~ lessonName:', lessonName);
        console.log(
          '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
        );

        Tts.voices().then(voices => {
          if (lessonName.toLocaleLowerCase().includes('english')) {
            const engVoice = voices.find(
              voice => voice.language === listLanguage['US English'],
            );
            updateDefaultVoice?.(
              isAndroid ? engVoice?.id : iosVoice[3].id,
              'US English',
            );
          } else if (lessonName.toLocaleLowerCase().includes('mandarin')) {
            const engVoice = voices.find(
              voice =>
                voice.language ===
                listLanguage['Mainland China, simplified characters'],
            );
            updateDefaultVoice?.(
              engVoice?.id,
              'Mainland China, simplified characters',
            );
          }
        });
      }, [lessonName, updateDefaultVoice]);

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

      const startAnimationRecord = useCallback(() => {
        scaleValue.value = withRepeat(
          withTiming(1, {duration: 1000, easing: Easing.out(Easing.ease)}),
          -1, // Repeat indefinitely
          false, // Enable reverse mode
        );
        opacityValue.value = withRepeat(
          withTiming(0, {duration: 1000, easing: Easing.linear}),
          -1, // Repeat indefinitely
          false, // Enable reverse mode
        );
      }, [opacityValue, scaleValue]);

      const stopAnimationRecord = useCallback(() => {
        // Stop the animations by setting the shared values to their initial states
        scaleValue.value = 0.05; // Reset to initial scale
        opacityValue.value = 1; // Reset to full opacity
      }, [scaleValue, opacityValue]);

      const startRecord = useCallback(() => {
        // Logs the initiation of the recording process to the console.
        console.log('start record');
        Haptics.selectionAsync();
        // Checks if there is no ongoing recording process (loadingRecord is false).
        if (!loadingRecord) {
          // Initiates the animation associated with recording. This could involve visual feedback like pulsing or scaling effects.
          startAnimationRecord();
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
      }, [loadingRecord, startAnimationRecord, lessonName, handleStartRecord]);

      const stopRecord = useCallback(() => {
        // Logs the termination of the recording process to the console.
        console.log('stop record');

        // Stops any ongoing animations associated with the recording.
        // This could involve stopping visual feedback like pulsing or scaling effects.
        stopAnimationRecord();

        // Calls the handleStopRecord function which likely stops the actual audio recording.
        // This function is expected to handle all necessary cleanup and finalization of the recording process.
        handleStopRecord();
      }, [handleStopRecord, stopAnimationRecord]);

      const longPressGesture = Gesture.LongPress()
        .onStart(() => {
          scaleLP.value = withSpring(1.2);
          runOnJS(startRecord)();
        })
        .onEnd(() => {
          scaleLP.value = withSpring(1);
          runOnJS(stopRecord)();
        });

      const animatedStyleLongPress = useAnimatedStyle(() => {
        return {
          transform: [{scale: scaleLP.value}],
          alignItems: 'center',
          justifyContent: 'center',
        };
      });

      useImperativeHandle(ref, () => ({
        isAnswerCorrect,
        onChoiceCorrectedAnswer: () => {
          setAnswerSelected(
            firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer ?? '',
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
        setTimeout(() => {
          startRecord();
        }, 5000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [moduleIndex]);

      // This effect updates the `answerSelected` state whenever `speechResult` changes.
      // `speechResult` is presumably the result from a speech-to-text operation.
      // If `speechResult` is undefined or null, it defaults to an empty string.
      useEffect(() => {
        setAnswerSelected(() => {
          if (speechResult !== '') {
            stopRecord();
          }
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
          backgroundAnswerColor="#DDF598"
          price="Free"
          score={selectedChild?.adsPoints}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <View>
              <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
                {word}
              </Text>
              <Animated.Image
                resizeMode={'contain'}
                width={WIDTH_SCREEN}
                height={scale(150)}
                style={[{}, animatedStyle]}
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
                <View style={styles.wrapCharContainer}>
                  {isCorrectAnswer ? (
                    <Text
                      style={[
                        styles.fonts_SVN_Cherish,
                        styles.textQuestion,
                        styles.textGreen,
                      ]}>
                      {answerSelected}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.fonts_EinaBold,
                        styles.textQuestion,
                        styles.textRed,
                      ]}>
                      {answerSelected}
                    </Text>
                  )}
                </View>

                <GestureDetector gesture={longPressGesture}>
                  <Animated.View style={animatedStyleLongPress}>
                    <Animated.View style={animatedCircleStyle} />
                    <TouchableOpacity
                      activeOpacity={1}
                      onLongPress={() => {
                        console.log('long press');
                      }}>
                      <Image
                        source={assets.icon_voice}
                        style={styles.iconImageContainer}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </GestureDetector>
                <View style={{marginTop: verticalScale(10)}} />
                <Text style={styles.hintText}>
                  to record the answer Hold the button
                </Text>
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
                style={[styles.mt24]}
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

export default PronunciationLesson;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_EinaBold: {
    fontFamily: FontFamily.Eina01Bold,
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
    fontSize: verticalScale(64),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
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
    fontFamily: FontFamily.Eina01Bold,
    color: COLORS.PRIMARY,
    fontSize: scale(12),
  },
});
