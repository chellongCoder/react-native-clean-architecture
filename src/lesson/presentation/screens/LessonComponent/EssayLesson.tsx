import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import {COLORS} from 'src/core/presentation/constants/colors';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSettingLesson} from '../../hooks/useSettingLesson';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
  backgroundImage?: string;
};

const EssayLesson = ({
  moduleIndex,
  nextModule,
  totalModule,
  lessonName,
  moduleName,
  firstMiniTestTask,
  backgroundImage,
}: Props) => {
  const globalStyle = useGlobalStyle();

  const [answerSelectedChars, setAnswerSelectedChars] = useState<string[]>([]);

  const [selectedStack, setSelectedStack] = useState<
    {index: number; indexFill: number}[]
  >([]);

  const answerSelected = useMemo(
    () => answerSelectedChars.join(''),
    [answerSelectedChars],
  );

  const opacity = useSharedValue(1);

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
      setSelectedStack([]);
      setAnswerSelectedChars([]);
      nextModule(answerSelected);
    },
    fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
  });

  const onPressItem = useCallback(
    (char: string, index: number) => {
      const stackItem = selectedStack.find(v => v.index === index);
      if (stackItem) {
        answerSelectedChars[stackItem.indexFill] = '_';
        setAnswerSelectedChars([...answerSelectedChars]);
        setSelectedStack(
          selectedStack.filter(v => v.index !== stackItem.index),
        );
      } else {
        const indexEmpty = answerSelectedChars.findIndex(v => v === '_');
        answerSelectedChars[indexEmpty] = char;
        setAnswerSelectedChars([...answerSelectedChars]);
        selectedStack.push({index: index, indexFill: indexEmpty});
        setSelectedStack([...selectedStack]);
      }
    },
    [selectedStack, answerSelectedChars],
  );

  useEffect(() => {
    const content = firstMiniTestTask?.question?.[moduleIndex]?.content;

    if (content) {
      // First, remove single spaces between underscores
      let modifiedContent = content.replace(/(?<=_)\s(?=_)/g, '');
      // Then, reduce sequences of more than one space to a single space
      modifiedContent = modifiedContent.replace(/\s{2,}/g, ' ');
      setAnswerSelectedChars(modifiedContent.split(''));
    }
  }, [firstMiniTestTask?.question, moduleIndex]);

  useEffect(() => {
    opacity.value = withTiming(0, {duration: 500}, () => {
      opacity.value = withTiming(1, {duration: 500});
    });
  }, [moduleIndex, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  return (
    <LessonComponent
      backgroundImage={backgroundImage}
      lessonName={lessonName}
      module={moduleName}
      part={firstMiniTestTask?.name}
      backgroundColor="#66c270"
      backgroundAnswerColor="#DDF598"
      price="Free"
      score={10}
      isAnswerCorrect={isAnswerCorrect}
      isShowCorrectContainer={isShowCorrectContainer}
      buildQuestion={
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            {word}
          </Text>
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
          <Text style={[globalStyle.txtLabel, styles.pb16, styles.textColor]}>
            Choose the correct answer
          </Text>
          <View style={[styles.boxSelected]}>
            <Text
              style={[
                styles.fonts_SVN_Cherish,
                styles.textQuestion,
                styles.textGreen,
                styles.mt8,
              ]}>
              {answerSelected}
            </Text>
            <View style={[styles.wapper, styles.fill]}>
              {firstMiniTestTask?.question?.[moduleIndex]?.answers?.map(
                (e, i) => {
                  const bg = selectedStack.find(v => v.index === i)
                    ? '#66C270'
                    : '#F2B559';
                  const length =
                    firstMiniTestTask?.question?.[moduleIndex]?.answers
                      ?.length ?? 2;
                  const size = Math.min(
                    (WIDTH_SCREEN - 80) / (length / 2),
                    verticalScale(44),
                  );
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => onPressItem(e, i)}
                      style={[
                        styles.boxVowel,
                        {
                          backgroundColor: bg,
                          height: size,
                          width: size,
                        },
                      ]}>
                      <Text style={[styles.textVowel]}>{e}</Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
            {learningTimer !== 0 && (
              <View
                style={[
                  styles.boxSelected,
                  {
                    position: 'absolute',
                    zIndex: 999,
                    width: '100%',
                    height: '100%',
                    opacity: 0.7,
                  },
                ]}
              />
            )}
          </View>

          <PrimaryButton text="Submit" style={[styles.mt24]} onPress={submit} />
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
});
