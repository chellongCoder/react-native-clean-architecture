import {StyleSheet, Text, View} from 'react-native';
import React, {
  forwardRef,
  useCallback,
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
import {darkenColor, getCorrectAnswer} from 'src/core/presentation/utils';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {COLORS} from 'src/core/presentation/constants/colors';
import {useLessonSpeech} from '../../hooks/useLessonSpeech';
import ImageMeaning from '../../components/ImageMeaning';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';

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

const LatinLesson = ({
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

  const {lessonSetting} = useHomeStore();

  const i18n = useI18n();

  const settings = useMemo(
    () => getSetting(lessonSetting),
    [getSetting, lessonSetting],
  );

  const {isAnswerCorrect, isShowCorrectContainer, submit, word} =
    useSettingLesson({
      countDownTime: trainingCount <= 2 ? 0 : 5,
      isCorrectAnswer: !!isCorrect,
      onSubmit: () => {
        setAnswerSelected('');
        nextModule(answerSelected);
        setIscorrect(false);
      },
      fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
      totalTime: 15 * 60, // * tổng time làm 1câu
    });

  const characterImage = useMemo(() => {
    return isAnswerCorrect === true || isAnswerCorrect === undefined
      ? characterImageSuccess
      : characterImageFail;
  }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

  const {onSpeechText} = useLessonSpeech({
    text: getCorrectAnswer(
      firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer
        ?.toString()
        .toLowerCase(),
    ),
  });

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
    formData.append('language', 'la');

    imageToText(formData)
      .then(data => {
        const char = data.data?.data ?? '';
        const charAnswer =
          firstMiniTestTask?.question?.[moduleIndex].fullAnswer;
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
      price="Free"
      score={selectedChild?.adsPoints}
      txtCountDown={
        word?.toString() ===
        firstMiniTestTask?.question?.[moduleIndex].correctAnswer
          ? undefined
          : word
      }
      isAnswerCorrect={isAnswerCorrect}
      isShowCorrectContainer={isShowCorrectContainer}
      buildQuestion={
        <View>
          <Text
            style={[
              styles.fonts_SVN_Cherish,
              styles.textQuestion,
              {color: settings.backgroundColor},
            ]}>
            {firstMiniTestTask?.question?.[moduleIndex].content}
          </Text>

          <ImageMeaning
            descriptionImage={
              firstMiniTestTask?.question?.[moduleIndex].image as string
            }
            image={firstMiniTestTask?.question?.[moduleIndex].image as string}
          />
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={[
                globalStyle.txtLabel,
                {color: darkenColor(settings.backgroundButtonColor ?? '', 20)},
              ]}>
              {i18n.t('lesson.screens.Modules.writeThe')} "
              {firstMiniTestTask?.question?.[moduleIndex].fullAnswer}"
            </Text>
            <VoiceButton onPress={onSpeechText} />
          </View>

          <View style={{height: verticalScale(10)}} />
          <CanvasWrite
            ref={canvasWriteRef}
            text={{
              content: answerSelected ?? '',
              style: {color: COLORS.PRIMARY},
              show: !!answerSelected,
            }}
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
};

export default forwardRef(LatinLesson);

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
  iconAIVoiceContainer: {height: scale(39), width: scale(34)},
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
});
