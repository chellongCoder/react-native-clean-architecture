import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: () => void;
};

const TranslateLesson = ({moduleIndex, nextModule, totalModule}: Props) => {
  const globalStyle = useGlobalStyle();
  return (
    <LessonComponent
      module="Module 5"
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
            hôm nay{'\n'}tôi cảm thấy vui vẻ
          </Text>
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <Text style={[globalStyle.txtLabel, styles.pb32, styles.txtWhite]}>
            Translate to English
          </Text>
          <View style={[styles.row, styles.pb32]}>
            <View style={[styles.boxWord]}>
              <Text style={globalStyle.txtLabel}>I</Text>
            </View>

            <View style={[styles.boxWord]}>
              <Text style={globalStyle.txtLabel}>Today</Text>
            </View>

            <View style={[styles.boxWord]}>
              <Text style={globalStyle.txtLabel}>Happy</Text>
            </View>

            <View style={[styles.boxWord]}>
              <Text style={globalStyle.txtLabel}>feel</Text>
            </View>
          </View>
          <View style={[styles.boxSelected]} />
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

export default TranslateLesson;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
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
  boxWord: {
    backgroundColor: '#FBF8CC',
    borderRadius: 15,
    padding: 12,
    marginRight: 8,
  },
  boxSelected: {
    backgroundColor: '#FBF8CC',
    height: 150,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
