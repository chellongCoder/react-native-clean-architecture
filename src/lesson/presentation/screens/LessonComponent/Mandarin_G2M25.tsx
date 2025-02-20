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
import {
  assets,
  getCorrectAnswer,
  isAndroid,
  splitChineseWithFilter,
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

const Mandarin_G2M25 = ({
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
      prompt={
        firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
          descrption: settings.prompt?.toString() ?? '',
        }
      }
      score={selectedChild?.adsPoints}
      isAnswerCorrect={isAnswerCorrect}
      isShowCorrectContainer={isShowCorrectContainer}
      buildQuestion={
        <View>
          <Text style={[styles.fonts_NeuzeitBold, styles.textQuestion]}>
            {firstMiniTestTask?.question?.[moduleIndex].content}
          </Text>
          <Text style={[styles.fonts_Neuzeit, styles.textQuestion2]}>
            {firstMiniTestTask?.question?.[moduleIndex].description}
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
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: COLORS.WHITE_FBF8CC,
              borderRadius: scale(30),
            }}>
            {splitChineseWithFilter(
              firstMiniTestTask?.question?.[moduleIndex]?.answers?.toString() ??
                '',
            )?.map((item, index) => (
              <HanziWrite
                key={index}
                ref={canvasWriteRef}
                text={{
                  content: item,
                  color: COLORS.PRIMARY,
                }}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onComplete={totalMistakes => {
                  setIscorrect(true);
                }}
              />
            ))}
          </View>
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

export default Mandarin_G2M25;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_NeuzeitBold: {
    fontFamily: FontFamily.SVNNeuzeitBold,
  },
  fonts_Neuzeit: {
    fontFamily: FontFamily.SVNNeuzeitRegular,
  },
  textLarge: {
    fontSize: 140,
    textAlign: 'center',
    color: 'white',
  },
  textQuestion: {
    fontSize: scale(32),
    textAlign: 'center',
    color: COLORS.RED_811010,
  },
  textQuestion2: {
    fontSize: scale(20),
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
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
});
