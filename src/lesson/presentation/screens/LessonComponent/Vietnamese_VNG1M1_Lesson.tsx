/* eslint-disable react/no-unstable-nested-components */
import {StyleSheet, Text, View} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
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
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import LearningImage from '../../components/LearningImage';
import LearningText from '../../components/LearningText';
import KeyboardNumber, {
  SelectionAnswersQuestionRef,
} from '../../components/KeyboardNumber';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';
import {LessonRef} from '../../types';

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

const VnG1M1Lesson = forwardRef<LessonRef, Props>(
  (
    {
      moduleIndex,
      nextModule,
      totalModule,
      lessonName,
      moduleName,
      firstMiniTestTask,
      backgroundImage,
      characterImageFail,
      characterImageSuccess,
    }: Props,
    ref,
  ) => {
    const globalStyle = useGlobalStyle();
    const {selectedChild} = useAuthenticationStore();
    const [answerSelected, setAnswerSelected] = useState('');
    const {trainingCount, getSetting} = useLessonStore();
    const [isCorrect, setIscorrect] = useState(false);
    const answerRef = useRef<SelectionAnswersQuestionRef>(null);

    const {ttsSpeak, updateDefaultVoice} = useContext(TextToSpeechContext);
    const focus = useIsFocused();
    const {lessonSetting} = useHomeStore();

    const i18n = useI18n();

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
          answerRef?.current?.resetAnswerSelected();
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

    const images = useMemo(() => {
      const image = firstMiniTestTask?.question?.[moduleIndex].image;
      if (typeof image === 'string') {
        return [image];
      }
      return firstMiniTestTask?.question?.[moduleIndex].image as string[];
    }, [firstMiniTestTask?.question, moduleIndex]);

    const onSpeechText = useCallback(() => {
      ttsSpeak?.(
        getCorrectAnswer(
          firstMiniTestTask?.question?.[moduleIndex].instruction.description,
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
    }, [
      onSpeechText,
      focus,
      firstMiniTestTask?.question,
      moduleIndex,
      firstMiniTestTask?.type,
    ]); // Added focus to the dependency array

    useEffect(() => {
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

    const onSubmit = useCallback(async () => {
      submit();
    }, [submit]);

    useImperativeHandle(ref, () => ({
      onSubmit: onSubmit,
      onChoiceCorrectedAnswer: () => {
        onSubmit();
      },
    }));

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
            <LearningImage images={images} />
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
                  {
                    color: darkenColor(
                      settings.backgroundButtonColor ?? '',
                      20,
                    ),
                  },
                ]}>
                {i18n.t('lesson.screens.Modules.chooseCorrectAnswer')}
              </Text>
              <VoiceButton onPress={() => onSpeechText()} />
            </View>

            <View style={{height: verticalScale(10)}} />

            <KeyboardNumber
              answer={
                (firstMiniTestTask?.question?.[moduleIndex]
                  .answers as string[]) ?? []
              }
              answerBuilder={e => <Text style={[styles.textAnswer]}>{e}</Text>}
              question={
                <Text style={[styles.fonts_Borel, styles.textQuestion]}>
                  {firstMiniTestTask?.question?.[moduleIndex].content ?? ''}
                </Text>
              }
              isShowCorrectContainer={isShowCorrectContainer}
              isAnswerCorrect={!!isAnswerCorrect}
              onSelectAnswer={(e: string[]) => {
                setIscorrect(
                  e[0] ===
                    firstMiniTestTask?.question?.[moduleIndex].correctAnswer,
                );
                setAnswerSelected(e.slice().pop() ?? '');
              }}
              learningTimer={learningTimer}
              ref={answerRef}
              isSelectOne={true}
            />

            <PrimaryButton
              text={i18n.t('lesson.screens.Modules.submit')}
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
  },
);

export default VnG1M1Lesson;

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
  textAnswer: {
    fontFamily: FontFamily.BorelRegular,
    fontSize: scale(16),
    textAlign: 'center',
    marginBottom: scale(-8),
    color: COLORS.WHITE_FBF8CC,
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
