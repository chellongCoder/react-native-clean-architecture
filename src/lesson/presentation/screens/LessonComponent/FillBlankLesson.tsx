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

const FillBlankLesson = ({moduleIndex, nextModule, totalModule}: Props) => {
  const globalStyle = useGlobalStyle();
  return (
    <LessonComponent
      module="Module 4"
      backgroundColor="#f28759"
      backgroundAnswerColor="#FFE699"
      buildQuestion={
        <View>
          <View style={styles.pb32} />
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            UỐNG ... NHỚ ...
          </Text>
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <Text style={[globalStyle.txtLabel, styles.pb32]}>
            Fill the blank
          </Text>
          <View style={[styles.rowBetween, styles.pb16]}>
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text style={[globalStyle.txtLabel]}>nuoc - nguon</Text>
            </View>
            <View style={styles.pr16} />
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text style={[globalStyle.txtLabel]}>truoc - nguon</Text>
            </View>
          </View>
          <View style={[styles.rowBetween, styles.pb32]}>
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text style={[globalStyle.txtLabel]}>nuoc - nguon</Text>
            </View>
            <View style={styles.pr16} />
            <View style={[styles.boxItemAnswer, styles.center, styles.fill]}>
              <Text style={[globalStyle.txtLabel]}>nuoc - nguon</Text>
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

export default FillBlankLesson;

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
});
