import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  darkenColor,
  getCorrectAnswer,
  isAndroid,
  WIDTH_SCREEN,
} from 'src/core/presentation/utils';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {COLORS} from 'src/core/presentation/constants/colors';
import Tts from 'react-native-tts';
import {
  iosVoice,
  listLanguage,
} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechProvider';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import LearningImage from '../../components/LearningImage';
import SelectionImagesQuestion, {
  SelectionAnswersQuestionRef,
} from '../../components/SelectionImagesQuestion';
import {SoundGlobalContext} from 'src/core/presentation/hooks/sound/SoundGlobalContext';
import {soundTrack} from 'src/core/presentation/hooks/sound/SoundGlobalProvider';
import {useIsFocused} from '@react-navigation/native';
import TextHighlight from '../../components/TextHighlight';

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
  answers: string[];
};

const ScienceLesson = ({
  moduleIndex,
  nextModule,
  totalModule,
  lessonName,
  moduleName,
  firstMiniTestTask,
  backgroundImage,
  characterImageFail,
  characterImageSuccess,
  answers,
}: Props) => {
  const globalStyle = useGlobalStyle();
  const {selectedChild} = useAuthenticationStore();
  const [answerSelected, setAnswerSelected] = useState('');
  const answerRef = useRef<SelectionAnswersQuestionRef>();

  const {ttsSpeak} = useContext(TextToSpeechContext);
  const focus = useIsFocused();

  const {trainingCount, getSetting} = useLessonStore();
  const isCorrectAnswer = useMemo(() => {
    return (
      `${answerSelected.trim().toLocaleLowerCase()}` ===
      firstMiniTestTask?.question?.[moduleIndex]?.fullAnswer.toLocaleLowerCase()
    );
  }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

  const listColors = answers;

  const {lessonSetting} = useHomeStore();

  const settings = useMemo(
    () => getSetting(lessonSetting),
    [getSetting, lessonSetting],
  );
  const colorsMix = useMemo(() => {
    // Step 1: Split the string by commas to get an array of file names
    const fileNames =
      firstMiniTestTask?.question?.[moduleIndex]?.content?.split?.(',');

    // Step 2: Remove the `.png` extension and add `#` prefix to each color code
    const colorCodes = fileNames?.map(
      fileName => `#${fileName.replace('.png', '')}`,
    );

    return colorCodes;
  }, [firstMiniTestTask?.question, moduleIndex]);

  const {updateDefaultVoice} = useContext(TextToSpeechContext);

  const {isAnswerCorrect, isShowCorrectContainer, submit, word, learningTimer} =
    useSettingLesson({
      countDownTime: trainingCount <= 2 ? 0 : 5,
      isCorrectAnswer: !!isCorrectAnswer,
      onSubmit: () => {
        setAnswerSelected('');
        nextModule(
          `${answerSelected.trim().toLocaleLowerCase().replace('#', '')}.png`,
        );
        answerRef.current?.resetAnswerSelected?.();
      },
      fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
      totalTime: 5 * 60, // * tổng time làm 1câu
    });

  const [currentIndex, setCurrentIndex] = useState(0);

  const isLearning = useMemo(() => learningTimer !== 0, [learningTimer]);

  const images = useMemo(
    () =>
      isLearning
        ? firstMiniTestTask?.question?.[moduleIndex].image ?? []
        : firstMiniTestTask?.question?.[moduleIndex].image.slice(1, 3) ?? [],
    [firstMiniTestTask?.question, isLearning, moduleIndex],
  );

  const content = useMemo(
    () =>
      isLearning
        ? undefined
        : firstMiniTestTask?.question?.[moduleIndex].content[currentIndex],
    [currentIndex, firstMiniTestTask?.question, isLearning, moduleIndex],
  );

  const description = useMemo(
    () =>
      isLearning
        ? undefined
        : firstMiniTestTask?.question?.[moduleIndex].description[currentIndex],
    [currentIndex, firstMiniTestTask?.question, isLearning, moduleIndex],
  );

  const descriptionImage = useMemo(
    () =>
      isLearning
        ? firstMiniTestTask?.question?.[moduleIndex].descriptionImage[
            currentIndex
          ]
        : firstMiniTestTask?.question?.[moduleIndex].descriptionImage.slice(
            1,
            3,
          )[currentIndex],
    [currentIndex, firstMiniTestTask?.question, isLearning, moduleIndex],
  );

  const characterImage = useMemo(() => {
    return isAnswerCorrect === true || isAnswerCorrect === undefined
      ? characterImageSuccess
      : characterImageFail;
  }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

  const onSpeechText = useCallback(() => {
    ttsSpeak?.(
      isLearning
        ? firstMiniTestTask?.question?.[moduleIndex].descriptionImage[0] ?? ''
        : getCorrectAnswer(content),
    );
  }, [content, ttsSpeak, isLearning, firstMiniTestTask, moduleIndex]);

  useEffect(() => {
    if (focus) {
      // Check if the component is focused
      const firstTimeout = setTimeout(() => {
        onSpeechText();

        const secondTimeout = setTimeout(() => {
          onSpeechText();
        }, 1500);

        return () => clearTimeout(secondTimeout);
      }, 100);

      return () => clearTimeout(firstTimeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstMiniTestTask, moduleIndex, focus]); // Added focus to the dependency array

  // useEffect(() => {
  //   if (!isLearning) {
  //     onSpeechText();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLearning]);

  useEffect(() => {
    console.log(
      '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log('🛠 LOG: 🚀 --> ~ Tts.voices ~ lessonName:', lessonName);
    console.log(
      '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
    );

    Tts.voices().then(voices => {
      const engVoice = voices.find(
        voice => voice.language === listLanguage['US English'],
      );
      updateDefaultVoice?.(
        isAndroid ? engVoice?.id : iosVoice[3].id,
        'US English',
      );
    });
  }, [lessonName, updateDefaultVoice]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000 / images.length); // Change image every 1 second

    return () => {
      clearInterval(interval);
      setCurrentIndex(0);
    }; // Cleanup interval on component unmount
  }, [images]);

  return (
    <LessonComponent
      backgroundImage={backgroundImage}
      characterImage={characterImage}
      characterStyle={{marginBottom: scale(-34)}}
      lessonName={lessonName}
      module={moduleName}
      part={firstMiniTestTask?.name}
      backgroundColor="#66c270"
      backgroundAnswerColor={settings.backgroundAnswerColor}
      prompt={
        firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
          description: settings.prompt?.toString() ?? '',
        }
      }
      score={selectedChild?.adsPoints}
      isAnswerCorrect={isAnswerCorrect}
      isShowCorrectContainer={isShowCorrectContainer}
      txtCountDown={
        word === firstMiniTestTask?.question?.[moduleIndex].fullAnswer
          ? undefined
          : word
      }
      buildQuestion={
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            {descriptionImage}
          </Text>
          <LearningImage images={[images[currentIndex]]} />
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={[
                globalStyle.txtLabel,
                {color: darkenColor(settings.backgroundButtonColor ?? '', 30)},
              ]}>
              Choose correct answer
            </Text>
            <TouchableOpacity onPress={onSpeechText}>
              <Image
                source={require('../../../../../assets/images/icon_speech.png')}
                style={styles.iconImageContainer}
              />
            </TouchableOpacity>
          </View>

          <SelectionImagesQuestion
            question={
              <TextHighlight
                content={description ?? ''}
                description={content ?? ''}
              />
            }
            answers={
              (firstMiniTestTask?.question?.[moduleIndex]
                .answers as string[]) ?? []
            }
            isShowCorrectContainer={isShowCorrectContainer}
            isAnswerCorrect={!!isAnswerCorrect}
            onSelectAnswer={(e: string[]) => {
              setAnswerSelected(e[0]);
            }}
            learningTimer={learningTimer}
            isSelectOne
            ref={answerRef}
          />

          <PrimaryButton
            text="Submit"
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
};

export default ScienceLesson;

const Circle = ({
  bg,
  size,
  mh,
  mv,
  onPress,
}: {
  bg: string;
  size: number;
  mh?: number;
  mv?: number;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: bg?.startsWith('#') ? bg : undefined,
          height: size,
          width: size,
          borderRadius: size / 2,
          marginHorizontal: mh,
          marginVertical: mv,
          overflow: 'hidden',
        },
      ]}>
      <Image source={{uri: bg}} style={{flex: 1}} resizeMode="cover" />
    </TouchableOpacity>
  );
};

const ColorMixing = ({
  color1,
  color2,
  colorMixed,
  enable = true,
}: {
  color1: string;
  color2: string;
  colorMixed: string;
  enable?: boolean;
}) => {
  const circleSize = 106;
  const spacing = 24;
  const isHapticed = useRef(false);

  const translateX1 = useSharedValue(0.0);
  const translateY1 = useSharedValue(0.0);
  const translateX2 = useSharedValue(0.0);
  const translateY2 = useSharedValue(0.0);

  const [isMixed, setIsMixed] = useState(false);

  const checkIntersect = useCallback(() => {
    'worklet';
    const coordinateX1 = translateX1.value;
    const coordinateY1 = translateY1.value;
    const coordinateX2 = translateX2.value + circleSize + spacing;
    const coordinateY2 = translateY2.value;
    return (
      (coordinateX2 - coordinateX1) ** 2 + (coordinateY2 - coordinateY1) ** 2 <=
      (circleSize / 8) ** 2
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pan1 = Gesture.Pan()
    .onChange(e => {
      translateX1.value = e.translationX;
      translateY1.value = e.translationY;
      if (checkIntersect()) {
        if (!isHapticed.current) {
          isHapticed.current = true;
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        }
      } else {
        isHapticed.current = false;
      }
    })
    .onFinalize(() => {
      if (checkIntersect()) {
        runOnJS(setIsMixed)(true);
      } else {
        translateX1.value = withSpring(0);
        translateY1.value = withSpring(0);
      }
    });

  const pan2 = Gesture.Pan()
    .onChange(e => {
      translateX2.value = e.translationX;
      translateY2.value = e.translationY;
    })
    .onFinalize(() => {
      if (checkIntersect()) {
        runOnJS(setIsMixed)(true);
      } else {
        translateX2.value = withSpring(0);
        translateY2.value = withSpring(0);
      }
    });

  const animatedStyles1 = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: withTiming(translateX1.value, {duration: 0})},
        {translateY: withTiming(translateY1.value, {duration: 0})},
      ],
    };
  });

  const animatedStyles2 = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: withTiming(translateX2.value, {duration: 0})},
        {translateY: withTiming(translateY2.value, {duration: 0})},
      ],
    };
  });

  const animatedStyles3 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            translateX1.value - circleSize - spacing - translateX2.value,
            {
              duration: 0,
            },
          ),
        },
        {
          translateY: withTiming(translateY1.value - translateY2.value, {
            duration: 0,
          }),
        },
      ],
    };
  });

  useEffect(() => {
    translateX1.value = 0;
    translateY1.value = 0;
    translateX2.value = 0;
    translateY2.value = 0;
    setIsMixed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color1, color2, colorMixed]);

  useEffect(() => {
    if (isMixed) {
      translateX1.value = 0;
      translateY1.value = 0;
      translateX2.value = 0;
      translateY2.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMixed]);
  return (
    <GestureHandlerRootView
      style={{marginTop: 50, flexDirection: 'row'}}
      pointerEvents={enable ? 'auto' : 'none'}>
      {isMixed ? (
        <Circle bg={colorMixed} size={circleSize} mh={spacing / 2} />
      ) : (
        <>
          <GestureDetector gesture={pan1}>
            <Animated.View style={[animatedStyles1]} pointerEvents={'box-only'}>
              <Circle bg={color1} size={circleSize} mh={spacing / 2} />
            </Animated.View>
          </GestureDetector>
          <GestureDetector gesture={pan2}>
            <Animated.View
              style={[
                animatedStyles2,
                {
                  overflow: 'hidden',
                  borderRadius: 500,
                  marginHorizontal: spacing / 2,
                },
              ]}
              pointerEvents={'box-only'}>
              <Circle bg={color2} size={circleSize} />
              <Animated.View
                style={[animatedStyles3, {position: 'absolute'}]}
                pointerEvents={'box-only'}>
                <Circle bg={colorMixed} size={circleSize} />
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textLarge: {
    fontSize: 140,
    textAlign: 'center',
    color: 'white',
  },
  textQuestion: {
    fontSize: scale(40),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pb32: {},
  mt32: {
    marginTop: verticalScale(10),
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  iconAIVoiceContainer: {height: scale(31), width: scale(31)},

  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },

  iconImageContainer: {
    height: verticalScale(45),
    width: verticalScale(40),
  },
});
