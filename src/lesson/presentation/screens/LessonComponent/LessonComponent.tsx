import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import IconDiamond from 'assets/svg/IconDiamond';
import IconStar from 'assets/svg/iconStar';
import BookView from '../../components/BookView';

type Props = {
  module?: string;
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
  module = '',
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

  return (
    <View
      style={[
        styles.screen,
        {paddingTop: insets.top, backgroundColor: backgroundColor},
      ]}>
      <View style={[styles.ph24, styles.fill]}>
        <View style={[styles.rowBetween]}>
          <View>
            <Text style={[styles.fonts_SVN_Cherish, styles.textTitle]}>
              VIETNAMESE
            </Text>
            <Text style={[styles.fonts_SVN_Cherish, styles.textModule]}>
              {module}
            </Text>
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
          {Array.from({length: totalModule}, (_, i) => {
            const bg =
              i < moduleIndex
                ? 'white'
                : i === moduleIndex
                ? '#F2B559'
                : '#258F78';
            return <Dotline key={i} bg={bg} />;
          })}
        </View>
      </View>
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
    fontSize: 40,
    color: 'white',
  },
  alightEnd: {
    alignItems: 'flex-end',
  },
  textModule: {
    fontSize: 20,
    color: '#258F78',
  },
  boxPrice: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
    padding: 6,
    width: 90,
    backgroundColor: '#FFE699',
  },
  textPrice: {
    fontSize: 18,
    color: '#1C6349',
    paddingHorizontal: 16,
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
