import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {Task} from 'src/home/application/types/GetListQuestionResponse';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
};

const VowelsLesson = ({
  moduleIndex,
  nextModule,
  totalModule,
  lessonName,
  moduleName,
  firstMiniTestTask,
}: Props) => {
  const globalStyle = useGlobalStyle();

  const [answerSelected, setAnswerSelected] = useState('');

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
          <Text style={[styles.fonts_SVN_Cherish, styles.textLarge]}>
            {firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer}
          </Text>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            {firstMiniTestTask?.question?.[moduleIndex]?.fullAnswer}
          </Text>
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
              {firstMiniTestTask?.question?.[moduleIndex]?.content}
            </Text>
            <View style={[styles.wapper, styles.fill]}>
              {firstMiniTestTask?.question?.[moduleIndex]?.answers?.map(
                (e, i) => {
                  const bg = e === answerSelected ? '#66C270' : '#F2B559';
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setAnswerSelected(e)}
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
          </View>
          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={() => {
              setAnswerSelected('');
              nextModule(answerSelected);
            }}
          />
        </View>
      }
      moduleIndex={moduleIndex}
      totalModule={totalModule}
    />
  );
};

export default VowelsLesson;

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
    color: 'white',
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
    backgroundColor: '#FBF8CC',
    height: 260,
    borderRadius: 30,
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
