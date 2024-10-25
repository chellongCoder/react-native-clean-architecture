import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import CanvasWrite, {CanvasWriteRef} from '../../components/CanvasWrite';
import HanziWrite from '../../components/HanziWrite';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {verticalScale} from 'react-native-size-matters';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
  backgroundImage?: string;
  characterImage?: string;
};

const WriteLesson = ({
  moduleIndex,
  nextModule,
  totalModule,
  lessonName,
  moduleName,
  firstMiniTestTask,
  backgroundImage,
  characterImage,
}: Props) => {
  const globalStyle = useGlobalStyle();
  const canvasWriteRef = useRef<CanvasWriteRef>(null);
  const {selectedChild} = useAuthenticationStore();

  return (
    <LessonComponent
      backgroundImage={backgroundImage}
      characterImage={characterImage}
      lessonName={lessonName}
      module={moduleName}
      part={firstMiniTestTask?.name}
      backgroundColor="#66c270"
      backgroundAnswerColor="#DDF598"
      score={selectedChild?.adsPoints}
      buildQuestion={
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            趨
          </Text>
          <Text style={[styles.fonts_SVN_Cherish, styles.textLarge]}>趨</Text>
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <Text style={[globalStyle.txtLabel]}>Write the "趨"</Text>
          <View style={{height: verticalScale(10)}} />
          <HanziWrite
            ref={canvasWriteRef}
            text={{content: '趨', color: '#66C270'}}
            matchPoints={matchPointsA}
          />
          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={() => {
              const result = canvasWriteRef.current?.getResult();
              const isCorrect =
                result &&
                result?.matchPointNumber > matchPointsA.length - 4 &&
                result?.strokesNumber <= 3 &&
                result.maxDistance <= 15;
              Alert.alert(
                'Kết quả',
                `${isCorrect ? 'chính xác' : 'không chính xác'}`,
              );
              canvasWriteRef.current?.reset();
              // nextModule();
            }}
          />
        </View>
      }
      moduleIndex={moduleIndex}
      totalModule={totalModule}
    />
  );
};

export default WriteLesson;

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
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pb32: {},
  mt32: {
    marginTop: 32,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
});

const matchPointsA = [
  [8.456913341175436, 130.62562561035156],
  [10.493090542879969, 111.93546225807884],
  [14.81996154785156, 93.64533441716975],
  [18.38327165083453, 73.50071438876066],
  [21.03756852583453, 57.46502546830611],
  [27.618767478249282, 42.70197504216975],
  [37.83600824529475, 38.30216147682883],
  [46.48975025523794, 48.592644431374296],
  [48.45321793989703, 65.17378789728338],
  [49.798543756658376, 80.2277207808061],
  [55.28893349387428, 92.48176019841975],
  [53.90725291859019, 104.33580849387428],
  [53.72545693137428, 123.46227333762428],
  [54.016339388760656, 130.22563448819247],
  [53.034605546431095, 112.62633583762428],
  [41.872007890181095, 106.80842035466975],
  [34.19997752796519, 109.75373285466975],
  [24.964470603249282, 107.97199457341975],
  [41.14480174671519, 18.01212241432883],
  [46.96242869984019, 5.9399011785333755],
  [42.19924510609019, 12.19416254216975],
].map(v => ({x: v[0], y: v[1]}));
