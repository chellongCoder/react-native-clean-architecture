import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
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
import {isMMSS} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import Animated, {
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
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';
import FastImage from 'react-native-fast-image';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  _firstMiniTestTask?: Task;
  backgroundImage?: string;
  characterImageSuccess?: string;
  characterImageFail?: string;
};

interface ImageAnswerOption {
  id: string;
  text: string;
  imageUrl: string;
}

const Science_Select_BGImageText = observer(
  forwardRef<LessonRef, Props>(
    (
      {
        moduleIndex,
        nextModule,
        totalModule,
        lessonName,
        moduleName,
        _firstMiniTestTask,
        backgroundImage,
        characterImageSuccess,
        characterImageFail,
      },
      ref,
    ) => {
      const globalStyle = useGlobalStyle();

      const {ttsSpeak} = useContext(TextToSpeechContext);
      const focus = useIsFocused();

      const [answerSelected, setAnswerSelected] = useState<string>('');

      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

      // Fake image options for different habitats
      const imageAnswerOptions: ImageAnswerOption[] = useMemo(
        () => [
          {
            id: 'savanna',
            text: 'SAVANNA',
            imageUrl:
              'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=200&fit=crop',
          },
          {
            id: 'arctic',
            text: 'ARCTIC',
            imageUrl:
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
          },
          {
            id: 'grasslands',
            text: 'GRASSLANDS AND FORESTS',
            imageUrl:
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
          },
        ],
        [],
      );

      const {
        isAnswerCorrect,
        isShowCorrectContainer,
        word,
        learningTimer,
        submit,
        toggleShowHint,
        resetLearning,
        resetTesting,
      } = useSettingLesson({
        countDownTime: trainingCount <= 2 ? 0 : 5,
        isCorrectAnswer: answerSelected === 'grasslands', // Correct answer is grasslands
        onSubmit: () => {
          const prompt =
            'Lions are known as the king of the jungle though they actually live in grasslands.';
          ttsSpeak?.(prompt);
          setTimeout(() => {
            resetLearning();
            resetTesting();
            setAnswerSelected('');
            nextModule(answerSelected.toString());
          }, prompt.length * 55);
        },
        fullAnswer:
          'Lions actually live in grasslands and forests, not in jungles as commonly believed.',
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
          'Lions are known as the king of the jungle though they actually live in grasslands. Where do lions live?',
        );
      }, [ttsSpeak]);

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
          setAnswerSelected('grasslands');
        },
      }));

      const handleImageAnswerSelect = (optionId: string) => {
        setAnswerSelected(optionId);
      };

      const renderImageAnswer = (option: ImageAnswerOption, index: number) => {
        const isSelected = answerSelected === option.id;
        const isCorrect = option.id === 'grasslands';
        const showResult = isShowCorrectContainer;

        let backgroundColor = '#66c270';
        if (option.id === 'arctic') {
          backgroundColor = '#87CEEB';
        } else if (option.id === 'grasslands') {
          backgroundColor = '#66c270';
        }

        if (showResult) {
          if (isCorrect) {
            backgroundColor = '#66c270';
          } else if (isSelected && !isCorrect) {
            backgroundColor = '#FF6B6B';
          }
        } else if (isSelected) {
          backgroundColor = '#4A90E2';
        }

        const positions = [
          {top: verticalScale(10), right: scale(-10)}, // SAVANNA
          {top: verticalScale(70), right: scale(-10)}, // ARCTIC
          {top: verticalScale(130), right: scale(-10)}, // GRASSLANDS
        ];

        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.overlayAnswerButton,
              {
                ...positions[index],
                borderWidth: isSelected || (showResult && isCorrect) ? 3 : 0,
                borderColor: isSelected ? '#FFFFFF' : 'transparent',
              },
            ]}
            onPress={() => !showResult && handleImageAnswerSelect(option.id)}
            disabled={showResult}>
            <View
              style={[
                {
                  borderTopLeftRadius: scale(12),
                  borderBottomLeftRadius: scale(12),
                  flex: 1,
                  height: verticalScale(20),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: -scale(5),
                },
                {
                  backgroundColor: backgroundColor,
                  borderWidth: isSelected || (showResult && isCorrect) ? 3 : 0,
                  borderColor: isSelected ? '#FFFFFF' : 'transparent',
                },
              ]}>
              <Text style={[styles.overlayAnswerText]}>{option.text}</Text>
            </View>
            <View style={styles.circularImageContainer}>
              <FastImage
                source={{uri: option.imageUrl}}
                style={styles.circularImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        );
      };

      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          characterStyle={{marginBottom: scale(-34)}}
          lessonName={lessonName}
          module={moduleName}
          part="Practice"
          backgroundColor="#66c270"
          backgroundAnswerColor={
            settings.backgroundAnswerColor ?? COLORS.GREEN_DDF598
          }
          prompt={{
            description:
              settings.prompt?.toString() ?? 'Choose the correct answer',
          }}
          price="Free"
          score={selectedChild?.adsPoints}
          txtCountDown={word && !isMMSS(word) ? undefined : word}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <View style={styles.landscapeContainer}>
              <Animated.View style={[styles.factTextOverlay, animatedStyle]}>
                <Text style={[styles.fonts_SVN_Cherish, styles.factText]}>
                  LIONS ARE KNOWN AS THE KING OF THE JUNGLE THOUGH THEY ACTUALLY
                  LIVE IN GRASSLANDS.
                </Text>
              </Animated.View>
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
                    Choose the correct answer
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>

              <View style={styles.questionTextContainer}>
                <Text style={[styles.fonts_SVN_Cherish, styles.questionText]}>
                  Where do lions live?
                </Text>
              </View>

              <View style={styles.answersContainer}>
                <FastImage
                  source={{
                    uri: imageAnswerOptions.find(
                      option => option.id === answerSelected,
                    )?.imageUrl,
                  }}
                  style={styles.landscapeBackground}
                  resizeMode="cover"
                />
                {imageAnswerOptions.map((option, index) =>
                  renderImageAnswer(option, index),
                )}
              </View>

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: settings.backgroundButtonColor},
                ]}
                onPress={submit}
                disable={learningTimer !== 0 || !answerSelected}
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

export default Science_Select_BGImageText;

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
  landscapeContainer: {
    position: 'relative',
    width: '100%',
    height: verticalScale(200),
    borderRadius: scale(16),
    overflow: 'hidden',
    marginHorizontal: scale(16),
  },
  landscapeBackground: {
    width: '90%',
    height: '100%',
    position: 'absolute',
    borderWidth: 1,
    borderRadius: scale(30),
    alignSelf: 'center',
  },
  factTextOverlay: {
    position: 'absolute',
    top: verticalScale(16),
    left: scale(16),
    right: scale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: scale(12),
    padding: scale(12),
  },
  factText: {
    fontSize: verticalScale(14),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
    lineHeight: verticalScale(18),
  },
  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  questionTextContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  questionText: {
    fontSize: verticalScale(18),
    color: '#1C6349',
    textAlign: 'center',
  },
  answersContainer: {
    position: 'relative',
    flex: 1,
  },
  overlayAnswerButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scale(16),
    paddingRight: scale(8),
    paddingVertical: verticalScale(8),
    borderRadius: scale(25),
    minWidth: scale(200),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayAnswerText: {
    fontSize: verticalScale(12),
    fontFamily: FontFamily.SVNCherishMoment,
  },
  circularImageContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  circularImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
});
