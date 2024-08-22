import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import {COLORS} from 'src/core/presentation/constants/colors';
import {assets} from 'src/core/presentation/utils';
import {useTimingQuestion} from '../../hooks/useTimingQuestion';
import {scale, verticalScale} from 'react-native-size-matters';
import {useCountDown} from '../../hooks/useCountDown';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
};

const EssayLesson = ({
  moduleIndex,
  nextModule,
  totalModule,
  lessonName,
  moduleName,
  firstMiniTestTask,
}: Props) => {
  const globalStyle = useGlobalStyle();

  const [answerSelectedChars, setAnswerSelectedChars] = useState<string[]>([]);

  const [selectedStack, setSelectedStack] = useState<{index: number; indexFill: number}[]>([]);

  const answerSelected = useMemo(() => answerSelectedChars.join(''), [answerSelectedChars])
  // const [answerSelected, setAnswerSelected] = useState('');
  const {
    start,
    stop,
    reset: resetLearning,
    time: learningTimer,
  } = useCountDown(5);

  const {time, reset: resetTesting} = useTimingQuestion(learningTimer === 0);

  const intervalRef = useRef<NodeJS.Timeout>();

  const word = useMemo(() => {
    if (learningTimer === 0) {
      if (time >= 0) {
        return `0:${time < 10 ? '0' + time : time}`;
      }
    }
    return firstMiniTestTask?.question?.[moduleIndex]?.fullAnswer;
  }, [firstMiniTestTask?.question, learningTimer, moduleIndex, time]);

  const onPressItem = useCallback((char: string, index: number) => {
    const stackItem = selectedStack.find((v) => v.index === index);
    if(stackItem) {
      answerSelectedChars[stackItem.indexFill] = '_'
      setAnswerSelectedChars([...answerSelectedChars]);
      setSelectedStack(selectedStack.filter(v => v.index !== stackItem.index))
    }else {
      const indexEmpty = answerSelectedChars.findIndex(v => v === '_')
      answerSelectedChars[indexEmpty] = char;
      setAnswerSelectedChars([...answerSelectedChars]);
      selectedStack.push({index: index, indexFill: indexEmpty})
      setSelectedStack([...selectedStack])
    }
  }, [selectedStack, answerSelectedChars])

  const onSubmit = useCallback(() => {
    setSelectedStack([]);
    setAnswerSelectedChars([]);
    nextModule(answerSelected);
    resetLearning();
    resetTesting();
  }, [answerSelected, nextModule, resetLearning, resetTesting]);

  useEffect(() => {
    intervalRef.current = start();
    return () => {
      stop(intervalRef.current!);
    };
  }, [start, stop]);

  useEffect(() => {
    if (learningTimer === 0) {
      stop(intervalRef.current!);
    }
  }, [learningTimer, stop]);

  useEffect(() => {
    const content = firstMiniTestTask?.question?.[moduleIndex]?.content
    if(content){
      setAnswerSelectedChars(content.split(''))
    }
  }, [moduleIndex, firstMiniTestTask?.question?.[moduleIndex]?.content])

  return (
    <LessonComponent
      lessonName={lessonName}
      module={moduleName}
      part={firstMiniTestTask?.name}
      backgroundColor="#66c270"
      backgroundAnswerColor="#DDF598"
      price="Free"
      buildQuestion={
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            {word}
          </Text>
          <Image source={assets.abcBook} />
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <Text style={[globalStyle.txtLabel, styles.pb32, styles.textColor]}>
            Choose the correct answer
          </Text>
          <View style={[styles.boxSelected]}>
            <Text
              style={[
                styles.fonts_SVN_Cherish,
                styles.textQuestion,
                styles.textGreen,
                styles.mt16,
              ]}>
              {answerSelected}
            </Text>
            <View style={[styles.wapper, styles.fill]}>
              {firstMiniTestTask?.question?.[moduleIndex]?.answers?.map(
                (e, i) => {
                  const bg = selectedStack.find(v => v.index === i) ? '#66C270' : '#F2B559';
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => onPressItem(e, i)}
                      style={[
                        styles.boxVowel,
                        {
                          backgroundColor: bg,
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
                    opacity: 0.7,
                  },
                ]}
              />
            )}
          </View>

          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={onSubmit}
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
    fontSize: 40,
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
  pb16: {
    paddingBottom: 16,
  },
  pb32: {
    paddingBottom: 32,
  },
  mt16: {
    marginTop: 16,
  },
  mt32: {
    marginTop: 32,
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
    fontSize: 32,
  },
  wapper: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
