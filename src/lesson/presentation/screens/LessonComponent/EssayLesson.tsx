import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import {useSettingLesson} from '../../hooks/useSettingLesson';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import CharScramble, {CharScrambleRep} from '../../components/CharScramble';

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

const EssayLesson = ({
  moduleIndex,
  nextModule,
  totalModule,
  lessonName,
  moduleName,
  firstMiniTestTask,
  backgroundImage,
  characterImageSuccess,
  characterImageFail,
}: Props) => {
  const globalStyle = useGlobalStyle();

  const [answerSelected, setAnswerSelected] = useState('');

  const opacity = useSharedValue(1);
  const scaleS = useSharedValue(1);
  const {getSetting} = useLessonStore();
  const {selectedChild} = useAuthenticationStore();
  const {lessonSetting} = useHomeStore();

  const settings = useMemo(
    () => getSetting(lessonSetting),
    [getSetting, lessonSetting],
  );
  const {ttsSpeak} = useContext(TextToSpeechContext);

  const charScrambleRep = useRef<CharScrambleRep>(null);

  const {
    isAnswerCorrect,
    isShowCorrectContainer,
    word,
    env,
    learningTimer,
    submit,
  } = useSettingLesson({
    countDownTime: 5,
    isCorrectAnswer:
      answerSelected ===
      firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
    onSubmit: () => {
      charScrambleRep.current?.reset();
      nextModule(answerSelected);
    },
    fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
  });

  const onSpeechText = useCallback(() => {
    ttsSpeak?.(
      firstMiniTestTask?.question?.[moduleIndex].fullAnswer
        .toString()
        .toLowerCase() ?? '',
    );
  }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

  const characterImage = useMemo(() => {
    return isAnswerCorrect === true || isAnswerCorrect === undefined
      ? characterImageSuccess
      : characterImageFail;
  }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

  useEffect(() => {
    opacity.value = withTiming(0, {duration: 500}, () => {
      opacity.value = withTiming(1, {duration: 500});
    });
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
      txtCountDown={!isMMSS(word ?? '') ? undefined : word}
      isAnswerCorrect={isAnswerCorrect}
      isShowCorrectContainer={isShowCorrectContainer}
      buildQuestion={
        <View>
          <Animated.Image
            resizeMode={'contain'}
            style={[
              {
                width: scale(200),
                height: verticalScale(140),
              },
              animatedStyle,
            ]}
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
                Choose the correct answer
              </Text>
            </View>

            <TouchableOpacity onPress={onSpeechText}>
              <Image
                source={require('../../../../../assets/images/icon_speech.png')}
                style={styles.iconImageContainer}
              />
            </TouchableOpacity>
          </View>
          <CharScramble
            ref={charScrambleRep}
            content={firstMiniTestTask?.question?.[moduleIndex]?.content}
            listChar={firstMiniTestTask?.question?.[moduleIndex]?.answers}
            learningTimer={learningTimer}
            onAnswerChanged={setAnswerSelected}
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

export default EssayLesson;

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
  textLarge: {
    fontSize: 140,
    textAlign: 'center',
    color: 'white',
  },
  textQuestion: {
    fontSize: verticalScale(34),
    textAlign: 'center',
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
