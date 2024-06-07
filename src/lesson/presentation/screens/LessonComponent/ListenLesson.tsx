import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconMic from 'assets/svg/IconMic';
import IconFrequency from 'assets/svg/IconFrequency';
import IconListen from 'assets/svg/IconListen';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: () => void;
};

const ListenLesson = ({moduleIndex, nextModule, totalModule}: Props) => {
  const globalStyle = useGlobalStyle();
  return (
    <LessonComponent
      module="Module 3"
      backgroundColor="#e2cbf7"
      backgroundAnswerColor="#98A1F5"
      buildQuestion={
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textLarge]}>Á</Text>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            CON CÁ
          </Text>
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <Text style={[globalStyle.txtLabel, styles.pb32, styles.txtWhite]}>
            Listen and Repeat
          </Text>
          <View style={[styles.rowBetween, styles.ph24, styles.pb16]}>
            <View style={[styles.boxIconListen, styles.bgListen]}>
              <IconListen />
            </View>
            <View style={[styles.boxIconListen, styles.bgRecord]}>
              <IconMic />
            </View>
          </View>
          <View style={[styles.boxIconFrequency]}>
            <IconFrequency />
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

export default ListenLesson;

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
  boxIconListen: {
    height: 96,
    width: 96,
    borderRadius: 15,
    backgroundColor: '#F2B559',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgListen: {
    backgroundColor: '#F2B559',
  },
  bgRecord: {
    backgroundColor: '#258F78',
  },
  boxIconFrequency: {
    backgroundColor: '#FBF8CC',
    height: 150,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
