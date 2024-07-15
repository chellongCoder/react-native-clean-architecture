import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';

type Props = {
  moduleIndex: number;
  totalModule: number;
nextModule: (e: string) => void;
};

const MathLesson = ({moduleIndex, nextModule, totalModule}: Props) => {
  const globalStyle = useGlobalStyle();
  return (
    <LessonComponent
      module="Module 7"
      backgroundColor="#a3f0df"
      backgroundAnswerColor="#358DBE"
      buildQuestion={
        <View>
          <View style={styles.pb32} />
          <Text
            style={[
              styles.fonts_SVN_Cherish,
              styles.textQuestion,
              styles.txtQuestionColor,
            ]}>
            56 + ? = 100
          </Text>
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <Text style={[globalStyle.txtLabel, styles.pb32, styles.txtWhite]}>
            Which is answer ?
          </Text>

          <View style={[styles.rowBetween, styles.pb16]}>
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                40
              </Text>
            </View>
            <View style={[styles.pr16]} />
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                54
              </Text>
            </View>
            <View style={[styles.pr16]} />
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                46
              </Text>
            </View>
          </View>

          <View style={[styles.rowBetween, styles.pb16]}>
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                45
              </Text>
            </View>
            <View style={[styles.pr16]} />
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                43
              </Text>
            </View>
            <View style={[styles.pr16]} />
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                44
              </Text>
            </View>
          </View>

          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={() => {
              nextModule();
            }}
          />
        </View>
      }
      moduleIndex={moduleIndex}
      totalModule={totalModule}
    />
  );
};

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
});
