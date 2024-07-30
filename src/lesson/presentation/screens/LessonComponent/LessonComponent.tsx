import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import IconDiamond from 'assets/svg/IconDiamond';
import IconStar from 'assets/svg/iconStar';
import BookView from '../../components/BookView';
import {assets, WIDTH_SCREEN} from 'src/core/presentation/utils';
import {COLORS} from 'src/core/presentation/constants/colors';
import {scale, verticalScale} from 'react-native-size-matters';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';

type Props = {
  lessonName?: string;
  module?: string;
  part?: string;
  backgroundColor?: string;
  backgroundAnswerColor: string;
  buildQuestion: React.ReactNode;
  buildAnswer: React.ReactNode;
  moduleIndex: number;
  totalModule: number;
  price?: string;
  score?: number;
};

const LessonComponent = ({
  lessonName = '',
  module = '',
  part = '',
  backgroundColor = '#66c270',
  backgroundAnswerColor = '#FFD75A',
  buildAnswer,
  buildQuestion,
  moduleIndex,
  totalModule,
  price = '',
  score = 0,
}: Props) => {
  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();
  return (
    <View
      style={[
        styles.screen,
        {paddingTop: 0, backgroundColor: backgroundColor},
      ]}>
      <ImageBackground
        source={assets.background_vowels}
        width={WIDTH_SCREEN}
        imageStyle={{marginBottom: -30}}
        resizeMode="cover"
        style={[styles.ph24, styles.fill]}>
        <View style={{height: insets.top}} />
        <View style={[styles.rowBetween, {alignItems: 'flex-start'}]}>
          <View
            style={[
              styles.rowBetween,
              {alignItems: 'center', maxWidth: scale(200)},
            ]}>
            <Text style={[styles.fonts_SVN_Cherish, styles.textTitle]}>
              {lessonName}
            </Text>
            <View
              style={{
                height: verticalScale(20),
                width: scale(3),
                backgroundColor: COLORS.GREEN_1C6349,
                borderRadius: scale(10),
                marginHorizontal: scale(8),
              }}
            />
            <View>
              <Text style={[globalStyle.txtButton, styles.textModule]}>
                {module}
              </Text>
              <Text style={[globalStyle.txtNote, styles.textPart]}>{part}</Text>
            </View>
          </View>
          <View style={styles.alightEnd}>
            <View style={[styles.boxPrice]}>
              <Text style={[styles.fonts_SVN_Cherish, styles.textPrice]}>
                {price}
              </Text>
              <IconDiamond />
            </View>
            <View style={styles.rowAlignCenter}>
              <Text style={[styles.fonts_SVN_Cherish, styles.textPrice]}>
                {score}
              </Text>
              <IconStar />
            </View>
          </View>
        </View>
        <View style={[styles.boxQuestion, styles.pb32]}>{buildQuestion}</View>
        <View style={[styles.tabs]}>
          {Array.from({length: totalModule > 30 ? 30 : totalModule}, (_, i) => {
            const bg =
              i < moduleIndex
                ? 'white'
                : i === moduleIndex
                ? '#F2B559'
                : '#258F78';
            return <Dotline key={i} bg={bg} />;
          })}
          {totalModule > 30 && (
            <Text style={[styles.fonts_SVN_Cherish, {color: COLORS.WHITE}]}>
              +{totalModule - 30}
            </Text>
          )}
        </View>
      </ImageBackground>
      <View style={[styles.h450]}>
        <BookView
          style={[styles.bookView]}
          contentStyle={[styles.content]}
          colorBg={backgroundAnswerColor}>
          <View style={[styles.boxAnswer]}>{buildAnswer}</View>
        </BookView>
      </View>
    </View>
  );
};

const Dotline = ({bg}: {bg: string}) => {
  return <View style={[styles.dotline, {backgroundColor: bg}]} />;
};

export default LessonComponent;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  screen: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#66c270',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  h450: {
    height: 450,
  },
  bookView: {
    height: 450,
    paddingTop: 0,
    paddingBottom: 0,
  },
  content: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  p16: {
    padding: 16,
  },
  pb16: {
    paddingBottom: 16,
  },
  ph24: {
    paddingHorizontal: 24,
  },
  pb32: {
    paddingBottom: 32,
  },
  pv32: {
    paddingVertical: 32,
  },
  ph32: {
    paddingHorizontal: 32,
  },
  mt32: {
    marginTop: 32,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textTitle: {
    fontSize: 30,
    color: COLORS.GREEN_1C6349,
  },
  alightEnd: {
    alignItems: 'flex-end',
  },
  textModule: {
    fontSize: 10,
    color: COLORS.BLUE_258F78,
  },
  textPart: {
    fontSize: 10,
    color: COLORS.BLUE_258F78,
    fontWeight: '300',
  },
  boxPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 100,
    width: 90,
    backgroundColor: '#FFE699',
  },
  textPrice: {
    fontSize: 18,
    color: '#1C6349',
  },
  boxQuestion: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
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
  boxAnswer: {
    flex: 1,
    padding: 32,
  },
  textW500s16White: {
    fontWeight: '500',
    fontSize: 16,
    color: 'white',
  },
  textW500s16Black: {
    fontWeight: '500',
    fontSize: 16,
    color: 'black',
  },
  dotline: {
    height: 6,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 3,
  },
  tabs: {
    flexDirection: 'row',
    paddingBottom: 14,
  },
});
