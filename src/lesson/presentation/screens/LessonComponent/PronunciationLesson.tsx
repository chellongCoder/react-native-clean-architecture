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
import {assets, WIDTH_SCREEN} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
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
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
};

export type VowelsRef = {
  onChoiceCorrectedAnswer: () => void;
};

const PronunciationLesson = observer(
  forwardRef<VowelsRef, Props>(
    (
      {
        moduleIndex,
        nextModule,
        totalModule,
        lessonName,
        moduleName,
        firstMiniTestTask,
      },
      ref,
    ) => {
      const globalStyle = useGlobalStyle();

      const {ttsSpeak} = useContext(TextToSpeechContext);
      const focus = useIsFocused();

      const [answerSelected, setAnswerSelected] = useState('');

      const isCorrectAnswer = useMemo(() => {
        return (
          answerSelected.toLocaleLowerCase() ===
          firstMiniTestTask?.question?.[
            moduleIndex
          ]?.fullAnswer.toLocaleLowerCase()
        );
      }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

      const {trainingCount} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();
      console.log(
        '🛠 LOG: 🚀 --> ------------------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log(
        '🛠 LOG: 🚀 --> ~ answerSelected:',
        answerSelected,
        firstMiniTestTask?.question?.[moduleIndex]?.fullAnswer,
        isCorrectAnswer,
      );
      console.log(
        '🛠 LOG: 🚀 --> ------------------------------------------------🛠 LOG: 🚀 -->',
      );
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
        totalTime: 5 * 60, // * tổng time làm 1câu
      });

      const scaleLP = useSharedValue(1);

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex].fullAnswer
            .toString()
            .toLowerCase() ?? '',
        );
      }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);

      useEffect(() => {
        setAnswerSelected(speechResult ?? '');
      }, [speechResult]);

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

      const startRecord = useCallback(() => {
        console.log('start record');
        handleStartRecord();
      }, [handleStartRecord]);

      const stopRecord = useCallback(() => {
        console.log('stop record');
        handleStopRecord();
      }, [handleStopRecord]);

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
        };
      });

      useImperativeHandle(ref, () => ({
        onChoiceCorrectedAnswer: () => {
          setAnswerSelected(
            firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer ?? '',
          );
        },
      }));

      return (
        <LessonComponent
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
                height={scale(200)}
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
