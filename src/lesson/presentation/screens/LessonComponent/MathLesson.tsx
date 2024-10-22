import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {assets} from 'src/core/presentation/utils';
import DraggableZoomableRotatableImage from '../../components/Ruler';
import {verticalScale} from 'react-native-size-matters';
import GeometryComponent from './GeometryComponent';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  backgroundImage?: string;
};

const MathLesson = ({
  moduleIndex,
  nextModule,
  totalModule,
  backgroundImage,
}: Props) => {
  const globalStyle = useGlobalStyle();
  return (
    <LessonComponent
      backgroundImage={backgroundImage}
      module="Module 7"
      lessonName={'route'}
      part={'firstMiniTestTask?.name'}
      backgroundColor="#a3f0df"
      backgroundAnswerColor="#358DBE"
      txtCountDown={'word'}
      buildQuestion={
        <View style={{width: '100%', aspectRatio: 4 / 3}}>
          {/* <Text
            style={[
              styles.fonts_SVN_Cherish,
              styles.textQuestion,
              styles.txtQuestionColor,
            ]}>
            56 + ? = 100
          </Text> */}
          <View
            style={{
              width: '100%',
              height: verticalScale(150),
            }}>
            <Image
              source={assets.rectangle}
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
          <GeometryComponent />
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
  rulerContainer: {
    width: '100%',
    height: verticalScale(80),
    zIndex: 999,
  },
});
