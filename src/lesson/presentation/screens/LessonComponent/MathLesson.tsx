import {Image, LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import LessonComponent from './LessonComponent';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {assets, getCorrectAnswer} from 'src/core/presentation/utils';
import DraggableZoomableRotatableImage, {
  DraggableImageRef,
} from '../../components/Ruler';
import {scale, verticalScale} from 'react-native-size-matters';
import GeometryComponent from './GeometryComponent';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {COLORS} from 'src/core/presentation/constants/colors';
import {LessonRef} from '../../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  backgroundImage?: string;
  characterImageSuccess?: string;
  characterImageFail?: string;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
};

const MathLesson = forwardRef<LessonRef, Props>(
  (
    {
      moduleIndex,
      nextModule,
      totalModule,
      backgroundImage,
      characterImageSuccess,
      characterImageFail,
      lessonName,
      moduleName,
      firstMiniTestTask,
    }: Props,
    ref,
  ) => {
    const imageRef = useRef<DraggableImageRef>(null);

    const globalStyle = useGlobalStyle();
    const [answerSelected, setAnswerSelected] = useState('');

    const {trainingCount, getSetting} = useLessonStore();

    const {selectedChild} = useAuthenticationStore();

    const isCorrectAnswer = useMemo(() => {
      return (
        answerSelected.trim().toLocaleLowerCase() ===
        getCorrectAnswer(
          firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
        )
          .trim()
          .toLocaleLowerCase()
      );
    }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

    const {lessonSetting} = useHomeStore();

    const settings = useMemo(
      () => getSetting(lessonSetting),
      [getSetting, lessonSetting],
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
    } = useSettingLesson({
      countDownTime: trainingCount <= 2 ? 0 : 5,
      isCorrectAnswer,
      onSubmit: () => {
        setAnswerSelected('');
        nextModule(answerSelected);
      },
      fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
      totalTime: 20,
    });

    const characterImage = useMemo(() => {
      return isAnswerCorrect === true || isAnswerCorrect === undefined
        ? characterImageSuccess
        : characterImageFail;
    }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

    const [geometryHeight, setGeometryHeight] = useState(0);

    const onLayout = (event: LayoutChangeEvent) => {
      const {height} = event.nativeEvent.layout;
      setGeometryHeight(height);
    };

    useImperativeHandle(ref, () => ({
      isAnswerCorrect,
      onChoiceCorrectedAnswer: () => {
        setAnswerSelected(
          firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer ?? '',
        );
      },
    }));

    useEffect(() => {
      if (moduleIndex) {
        imageRef.current?.resetAnimation();
      }
    }, [moduleIndex]);

    return (
      <LessonComponent
        backgroundImage={backgroundImage}
        characterImage={characterImage}
        module={moduleName}
        lessonName={lessonName}
        part={firstMiniTestTask?.name}
        backgroundColor="#a3f0df"
        backgroundAnswerColor={settings.backgroundAnswerColor}
        prompt={settings.prompt?.toString()}
        score={selectedChild?.adsPoints}
        txtCountDown={
          word === firstMiniTestTask?.question?.[moduleIndex].content
            ? undefined
            : word
        }
        isAnswerCorrect={isAnswerCorrect}
        isShowCorrectContainer={isShowCorrectContainer}
        onPressFlower={toggleShowHint}
        buildQuestion={
          <View style={{width: '80%'}}>
            <View
              style={{
                width: '100%',
                height: verticalScale(150),
              }}>
              <Image
                source={{
                  uri:
                    env.IMAGE_QUESTION_BASE_API_URL +
                    firstMiniTestTask?.question?.[moduleIndex].image,
                }}
                style={globalStyle.image_100}
                resizeMode="contain"
              />
            </View>
            <View style={styles.rulerContainer}>
              <DraggableZoomableRotatableImage
                source={assets.ruler_deg}
                style={globalStyle.image_100}
                ref={imageRef}
              />
            </View>
          </View>
        }
        buildAnswer={
          <View onLayout={onLayout} style={styles.fill}>
            <GeometryComponent
              question={firstMiniTestTask?.question?.[moduleIndex]}
              imageUrl={
                env.IMAGE_QUESTION_BASE_API_URL +
                firstMiniTestTask?.question?.[moduleIndex].image
              }
              selectedAnswer={answerSelected}
              _setSelectedAnswer={a => {
                setAnswerSelected(a);
              }}
              onSubmit={submit}
            />
            {learningTimer !== 0 && (
              <View
                style={[
                  styles.boxSelected,
                  {
                    position: 'absolute',
                    zIndex: 999,
                    width: '100%',
                    opacity: 0.7,
                    height: geometryHeight - scale(80),
                  },
                ]}
              />
            )}
          </View>
        }
        moduleIndex={moduleIndex}
        totalModule={totalModule}
      />
    );
  },
);

export default MathLesson;

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
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
  },
  txtWhite: {
    color: 'white',
  },
  txtQuestionColor: {
    color: '#1C6349',
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
  ph24: {
    paddingHorizontal: 24,
  },
  pr16: {
    paddingRight: 16,
  },
  pb16: {
    paddingBottom: 16,
  },
  pb32: {
    paddingBottom: 32,
  },
  mt32: {
    marginTop: 32,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  boxItemAnswer: {
    height: 94,
    backgroundColor: COLORS.YELLOW_F2B559,
    borderRadius: 15,
  },
  rulerContainer: {
    width: '100%',
    height: verticalScale(80),
    zIndex: 999,
  },
  boxSelected: {
    backgroundColor: COLORS.WHITE_FFFBE3,
    height: verticalScale(230),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
});
