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
import {CanvasWriteRef} from '../../components/CanvasWrite';
import HanziWrite from '../../components/HanziWrite';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {scale, verticalScale} from 'react-native-size-matters';
import {assets, getCorrectAnswer, isAndroid} from 'src/core/presentation/utils';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {COLORS} from 'src/core/presentation/constants/colors';
import Tts from 'react-native-tts';
import {
  iosVoice,
  listLanguage,
} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechProvider';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {useIsFocused} from '@react-navigation/native';
import ImageMeaning from '../../components/ImageMeaning';
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
};

const WriteLesson = ({
  moduleIndex,
  nextModule,
  totalModule,
  lessonName,
  moduleName,
  firstMiniTestTask,
  backgroundImage,
  characterImageFail,
  characterImageSuccess,
}: Props) => {
  const globalStyle = useGlobalStyle();
  const canvasWriteRef = useRef<CanvasWriteRef>(null);
  const {selectedChild} = useAuthenticationStore();
  const [answerSelected, setAnswerSelected] = useState('');
  const {trainingCount, getSetting} = useLessonStore();
  const [isCorrect, setIscorrect] = useState(false);

  const {ttsSpeak, updateDefaultVoice} = useContext(TextToSpeechContext);
  const focus = useIsFocused();
  const {lessonSetting} = useHomeStore();

  const settings = useMemo(
    () => getSetting(lessonSetting),
    [getSetting, lessonSetting],
  );

  const {isAnswerCorrect, isShowCorrectContainer, submit} = useSettingLesson({
    countDownTime: trainingCount <= 2 ? 0 : 5,
    isCorrectAnswer: !!isCorrect,
    onSubmit: () => {
      setAnswerSelected('');
      nextModule(answerSelected);
      setIscorrect(false);
    },
    fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
    totalTime: 5 * 60, // * tổng time làm 1câu
  });

  const characterImage = useMemo(() => {
    return isAnswerCorrect === true || isAnswerCorrect === undefined
      ? characterImageSuccess
      : characterImageFail;
  }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

  const onSpeechText = useCallback(() => {
    ttsSpeak?.(
      getCorrectAnswer(
        firstMiniTestTask?.question?.[moduleIndex].correctAnswer,
      ),
    );
  }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

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
      buildQuestion={
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            {firstMiniTestTask?.question?.[moduleIndex].content}
          </Text>

          <ImageMeaning
            descriptionImage={
              firstMiniTestTask?.question?.[moduleIndex].descriptionImage
            }
            image={firstMiniTestTask?.question?.[moduleIndex].image}
          />
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text style={[globalStyle.txtLabel]}>
              Write the "{firstMiniTestTask?.question?.[moduleIndex].answers}"
            </Text>
            <TouchableOpacity onPress={onSpeechText}>
              <Image
                source={assets.icon_speech}
                style={styles.iconAIVoiceContainer}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={{height: verticalScale(10)}} />
          <HanziWrite
            ref={canvasWriteRef}
            text={{
              content:
                firstMiniTestTask?.question?.[
                  moduleIndex
                ]?.answers?.toString() ?? '',
              color: COLORS.PRIMARY,
            }}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onComplete={totalMistakes => {
              setIscorrect(true);
            }}
          />
          <PrimaryButton text="Submit" style={[styles.mt32]} onPress={submit} />
        </View>
      }
      moduleIndex={moduleIndex}
      totalModule={totalModule}
    />
  );
};

export default WriteLesson;

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
    marginTop: 32,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  iconAIVoiceContainer: {height: scale(31), width: scale(31)},
});

const matchPointsA = [
  [8.456913341175436, 130.62562561035156],
  [10.493090542879969, 111.93546225807884],
  [14.81996154785156, 93.64533441716975],
  [18.38327165083453, 73.50071438876066],
  [21.03756852583453, 57.46502546830611],
  [27.618767478249282, 42.70197504216975],
  [37.83600824529475, 38.30216147682883],
  [46.48975025523794, 48.592644431374296],
  [48.45321793989703, 65.17378789728338],
  [49.798543756658376, 80.2277207808061],
  [55.28893349387428, 92.48176019841975],
  [53.90725291859019, 104.33580849387428],
  [53.72545693137428, 123.46227333762428],
  [54.016339388760656, 130.22563448819247],
  [53.034605546431095, 112.62633583762428],
  [41.872007890181095, 106.80842035466975],
  [34.19997752796519, 109.75373285466975],
  [24.964470603249282, 107.97199457341975],
  [41.14480174671519, 18.01212241432883],
  [46.96242869984019, 5.9399011785333755],
  [42.19924510609019, 12.19416254216975],
].map(v => ({x: v[0], y: v[1]}));
