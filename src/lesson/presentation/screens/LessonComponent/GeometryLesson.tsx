import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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

const GeometryLesson = ({moduleIndex, nextModule, totalModule}: Props) => {
  const globalStyle = useGlobalStyle();
  return (
    <LessonComponent
      module="Module 6"
      backgroundColor="#a3f0df"
      backgroundAnswerColor="#358DBE"
      buildQuestion={
        <View style={styles.fullWidth}>
          <TouchableOpacity style={[styles.geo1]} />
          <TouchableOpacity style={[styles.geo2]} />
          <TouchableOpacity style={[styles.geo3]} />
          <TouchableOpacity style={[styles.geo4]} />
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <Text style={[globalStyle.txtLabel, styles.pb32, styles.txtWhite]}>
            Which is circle?
          </Text>
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

export default GeometryLesson;

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
  fullWidth: {
    width: '100%',
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
    height: 230,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  geo1: {
    width: 106,
    height: 106,
    backgroundColor: '#F28759',
    position: 'absolute',
    top: 20,
    left: 20,
    transform: [{rotate: '45deg'}],
  },
  geo2: {
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F2B559',
    position: 'absolute',
    top: -10,
    left: 160,
    transform: [{rotate: '-30deg'}],
  },
  geo3: {
    width: 106,
    height: 106,
    borderRadius: 90,
    backgroundColor: '#3AB89C',
    position: 'absolute',
    top: 110,
    left: 100,
    transform: [{rotate: '45deg'}],
  },
  geo4: {
    width: 50,
    height: 50,
    backgroundColor: '#358DBE',
    position: 'absolute',
    top: 130,
    left: 240,
    transform: [{rotate: '45deg'}],
  },
});
