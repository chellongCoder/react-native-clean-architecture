import {Image, StyleSheet, Text, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import LessonComponent from './LessonComponent';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {assets} from 'src/core/presentation/utils';
import DraggableZoomableRotatableImage from '../../components/Ruler';
import {scale, verticalScale} from 'react-native-size-matters';
import GeometryComponent from './GeometryComponent';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {COLORS} from 'src/core/presentation/constants/colors';
import {LessonRef} from '../../types';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  backgroundImage?: string;
  characterImage?: string;
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
      characterImage,
      lessonName,
      moduleName,
      firstMiniTestTask,
    }: Props,
    ref,
  ) => {
    const globalStyle = useGlobalStyle();
    const [answerSelected, setAnswerSelected] = useState('');
    console.log(
      '🛠 LOG: 🚀 --> ------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log('🛠 LOG: 🚀 --> ~ answerSelected:', answerSelected);
    console.log(
      '🛠 LOG: 🚀 --> ------------------------------------------------🛠 LOG: 🚀 -->',
    );

    const {trainingCount} = useLessonStore();

    const {selectedChild} = useAuthenticationStore();

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
      isCorrectAnswer:
        answerSelected.trim() ===
        firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer.trim(),
      onSubmit: () => {
        setAnswerSelected('');
        nextModule(answerSelected);
      },
      fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
    });

    useImperativeHandle(ref, () => ({
      isAnswerCorrect,
      onChoiceCorrectedAnswer: () => {
        setAnswerSelected(
          firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer ?? '',
        );
      },
    }));

    return (
      <LessonComponent
        backgroundImage={backgroundImage}
        characterImage={characterImage}
        module={moduleName}
        lessonName={lessonName}
        part={firstMiniTestTask?.name}
        backgroundColor="#a3f0df"
        backgroundAnswerColor={COLORS.BLUE_A3F0DF}
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
          <View style={{width: '100%', aspectRatio: 4 / 3}}>
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
              />
            </View>
          </View>
        }
        buildAnswer={
          <View style={styles.fill}>
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
                    // height: '100%',
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
    backgroundColor: '#F2B559',
    borderRadius: 15,
  },
  rulerContainer: {
    width: '100%',
    height: verticalScale(80),
    zIndex: 999,
  },
  boxSelected: {
    backgroundColor: COLORS.WHITE_FFFBE3,
    height: verticalScale(220),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(28),
  },
});
