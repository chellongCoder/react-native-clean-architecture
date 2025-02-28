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
import CanvasWrite, {CanvasWriteRef} from '../../components/CanvasWrite';
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
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import LearningImage from '../../components/LearningImage';
import LearningText from '../../components/LearningText';

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

const VnG1M3Lesson = ({
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
  const {trainingCount, getSetting, imageToText} = useLessonStore();
  const [isCorrect, setIscorrect] = useState(false);
  const [countCall, setCountCall] = useState(0);

  const {ttsSpeak, updateDefaultVoice} = useContext(TextToSpeechContext);
  const focus = useIsFocused();
  const {lessonSetting} = useHomeStore();

  const settings = useMemo(
    () => getSetting(lessonSetting),
    [getSetting, lessonSetting],
  );

  const {isAnswerCorrect, isShowCorrectContainer, submit, learningTimer} =
    useSettingLesson({
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
      } else if (lessonName.toLocaleLowerCase().includes('tiếng việt')) {
        const vietnameseVoices = voices.filter(
          voice =>
            voice.language.startsWith('vi-') ||
            voice.name.toLowerCase().includes('vietnamese'),
        );

        updateDefaultVoice?.(vietnameseVoices[0]?.id, 'Vie (Vietnamese)');
      }
    });
  }, [lessonName, updateDefaultVoice]);

  const getDataString = (data: any): string => {
    return data instanceof Array ? data?.[0].toString() ?? '' : data.toString();
  };

  const onSubmit = useCallback(async () => {
    const base64 = canvasWriteRef.current?.getBase64();
    console.log('base64', base64);
    if (!base64) {
      return;
    }

    const formData = new FormData();

    const url = `data:image/png;base64,${base64}`;

    formData.append('file', {
      uri: url,
      name: 'file.jpeg',
      type: 'image/jpeg',
    } as any);
    formData.append('language', 'vi');

    imageToText(formData)
      .then(data => {
        const char = data.data?.data ?? '';
        const charAnswer = getDataString(
          firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        );
        console.log('imageToText', data, char, charAnswer);
        const charLowerCase = char?.toLocaleLowerCase();
        const charAnswerLowerCase = charAnswer?.toLocaleLowerCase();
        console.log(
          charLowerCase,
          charAnswerLowerCase,
          charLowerCase === charAnswerLowerCase,
        );
        setAnswerSelected(char);
        setIscorrect(
          data.success === true && charLowerCase === charAnswerLowerCase,
        );
        setCountCall(p => p + 1);
      })
      .catch(e => console.log(e, 'ERROR'));
  }, [firstMiniTestTask?.question, imageToText, moduleIndex]);

  useEffect(() => {
    canvasWriteRef.current?.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstMiniTestTask?.question?.[moduleIndex].content]);

  useEffect(() => {
    if (countCall > 0) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countCall]);

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
          description: settings.prompt?.toString() ?? '',
        }
      }
      score={selectedChild?.adsPoints}
      isAnswerCorrect={isAnswerCorrect}
      isShowCorrectContainer={isShowCorrectContainer}
      buildQuestion={
        <View style={[styles.center, {marginTop: scale(30)}]}>
          <LearningText
            style={[styles.fonts_Borel, styles.textQuestion]}
            texts={[firstMiniTestTask?.question?.[moduleIndex].content ?? '']}
          />

          <LearningImage
            images={
              learningTimer !== 0
                ? (firstMiniTestTask?.question?.[moduleIndex].image as string[])
                : (firstMiniTestTask?.question?.[moduleIndex].image.slice(
                    2,
                    4,
                  ) as string[])
            }
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
            <Text
              style={[
                globalStyle.txtLabel,
                {color: settings.backgroundButtonColor},
              ]}>
              Write the "
              {getDataString(
                firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
              )}
              "
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
          <CanvasWrite
            ref={canvasWriteRef}
            text={{
              content: answerSelected ?? '',
              style: {
                color: COLORS.PRIMARY,
                fontFamily: FontFamily.BorelRegular,
              },
              show: !!answerSelected,
            }}
            disable={learningTimer !== 0}
          />
          <PrimaryButton
            text="Submit"
            style={[
              styles.buttonContainer,
              {backgroundColor: settings.backgroundButtonColor},
            ]}
            onPress={onSubmit}
          />
        </View>
      }
      moduleIndex={moduleIndex}
      totalModule={totalModule}
    />
  );
};

export default VnG1M3Lesson;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_Borel: {
    fontFamily: FontFamily.BorelRegular,
  },
  textLarge: {
    fontSize: 140,
    textAlign: 'center',
    color: 'white',
  },
  textQuestion: {
    fontSize: scale(20),
    fontWeight: 'bold',
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
