/* eslint-disable react-native/no-inline-styles */
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
import {isAndroid, WIDTH_SCREEN} from 'src/core/presentation/utils';
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

  const {trainingCount, getSetting} = useLessonStore();
  const isCorrectAnswer = useMemo(() => {
    return (
      `${answerSelected.trim().toLocaleLowerCase().replace('#', '')}.png` ===
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
      firstMiniTestTask?.question?.[moduleIndex].content?.split(',');

    // Step 2: Remove the `.png` extension and add `#` prefix to each color code
    const colorCodes = fileNames?.map(
      fileName => `#${fileName.replace('.png', '')}`,
    );

    return colorCodes;
  }, [firstMiniTestTask?.question, moduleIndex]);

  const {updateDefaultVoice} = useContext(TextToSpeechContext);

  const {isAnswerCorrect, isShowCorrectContainer, submit, word} =
    useSettingLesson({
      countDownTime: trainingCount <= 2 ? 0 : 5,
      isCorrectAnswer: !!isCorrectAnswer,
      onSubmit: () => {
        setAnswerSelected('');
        nextModule(
          `${answerSelected.trim().toLocaleLowerCase().replace('#', '')}.png`,
        );
      },
      fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
      totalTime: 5 * 60, // * tổng time làm 1câu
    });

  const characterImage = useMemo(() => {
    return isAnswerCorrect === true || isAnswerCorrect === undefined
      ? characterImageSuccess
      : characterImageFail;
  }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

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

  return (
    <LessonComponent
      backgroundImage={backgroundImage}
      characterImage={characterImage}
      lessonName={lessonName}
      module={moduleName}
      part={firstMiniTestTask?.name}
      backgroundColor="#66c270"
      backgroundAnswerColor={settings.backgroundAnswerColor}
      prompt={settings.prompt?.toString()}
      score={selectedChild?.adsPoints}
      isAnswerCorrect={isAnswerCorrect}
      isShowCorrectContainer={isShowCorrectContainer}
      txtCountDown={
        word === firstMiniTestTask?.question?.[moduleIndex].fullAnswer
          ? undefined
          : word
      }
      buildQuestion={
        <ColorMixing
          color1={colorsMix?.[0]}
          color2={colorsMix?.[1]}
          colorMixed={`#${(
            firstMiniTestTask?.question?.[moduleIndex].correctAnswer as string
          ).replace('.png', '')}`}
        />
      }
      buildAnswer={
        <View style={styles.fill}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text style={[globalStyle.txtLabel]}>Chọn đáp án đúng</Text>
          </View>

          <View
            style={[
              {
                backgroundColor: '#FBF8CC',
                paddingVertical: 8,
                borderRadius: 32,
                marginTop: 12,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Circle
                bg={colorsMix?.[0]}
                size={verticalScale(32)}
                mh={15}
                mv={verticalScale(12)}
              />
              <Text
                style={[globalStyle.txtModule, {color: COLORS.GREEN_009C6F}]}>
                +
              </Text>
              <Circle
                bg={colorsMix?.[1]}
                size={verticalScale(32)}
                mh={15}
                mv={verticalScale(12)}
              />
              <Text
                style={[globalStyle.txtModule, {color: COLORS.GREEN_009C6F}]}>
                =
              </Text>
              {answerSelected ? (
                <Circle
                  bg={answerSelected}
                  size={verticalScale(32)}
                  mh={15}
                  mv={verticalScale(12)}
                />
              ) : (
                <Text
                  style={[
                    globalStyle.txtModule,
                    {color: COLORS.GREEN_009C6F, marginLeft: 15},
                  ]}>
                  ?
                </Text>
              )}
            </View>

            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              {listColors.map(e => (
                <Circle
                  bg={e}
                  size={verticalScale(54)}
                  mh={(WIDTH_SCREEN - verticalScale(54) * 3 - scale(64)) / 6}
                  mv={verticalScale(6)}
                  onPress={() => setAnswerSelected(e)}
                />
              ))}
            </View>
          </View>

          <PrimaryButton text="Submit" style={[styles.mt32]} onPress={submit} />
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
    color: COLORS.RED_811010,
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
  circleSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  circleMedium: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  circleLarge: {
    width: 106,
    height: 106,
    borderRadius: 53,
  },
});
