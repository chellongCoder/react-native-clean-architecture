import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import IconDiamond from 'assets/svg/IconDiamond';
import IconStar from 'assets/svg/iconStar';
import BookView from '../../components/BookView';
import {assets, WIDTH_SCREEN} from 'src/core/presentation/utils';
import {COLORS} from 'src/core/presentation/constants/colors';
import {scale, verticalScale} from 'react-native-size-matters';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import CustomSwitchNew from 'src/home/presentation/components/CustomSwitchNew';

type Props = {
  lessonName?: string;
  module?: string;
  part?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundAnswerColor: string;
  buildQuestion: React.ReactNode;
  buildAnswer: React.ReactNode;
  moduleIndex: number;
  totalModule: number;
  price?: string;
  score?: number;
  isAnswerCorrect?: boolean;
  isShowCorrectContainer?: boolean;
  onPressFlower?: () => void;
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
  score = 0,
  isShowCorrectContainer,
  isAnswerCorrect,
  onPressFlower,
  backgroundImage,
}: Props) => {
  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();

  const [source, setSource] = useState<ImageSourcePropType | undefined>({
    uri: backgroundImage,
  });

  const handleError = () => {
    setSource(assets.background_vowels);
  };

  return (
    <View
      style={[
        styles.screen,
        {paddingTop: 0, backgroundColor: backgroundColor},
      ]}>
      <ImageBackground
        onError={handleError}
        source={source}
        width={WIDTH_SCREEN}
        imageStyle={{marginBottom: -verticalScale(30)}}
        resizeMode="cover"
        style={[styles.fill]}>
        <View style={{height: insets.top}} />
        <View
          style={[
            styles.rowBetween,
            {alignItems: 'flex-start', marginHorizontal: scale(10)},
          ]}>
          <View style={[styles.rowBetween, {alignItems: 'center'}]}>
            <Text
              numberOfLines={2}
              style={[styles.fonts_SVN_Cherish, styles.textTitle]}>
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
          <TouchableOpacity onPress={onPressFlower}>
            <CustomSwitchNew
              point={score}
              value={false}
              onValueChange={() => {}}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.boxQuestion, styles.pb32]}>{buildQuestion}</View>
        <View style={styles.wrapDescriptionContainer}>
          <View style={styles.wrapImageContainer}>
            <Image
              source={require('../../../../../assets/images/barry_1.png')}
              style={styles.imageContainer}
            />
          </View>

          <View style={{flex: 1}}>
            {isShowCorrectContainer && (
              <View style={styles.wrapCorrectContainer}>
                <Text style={styles.correctTitle}>
                  {isAnswerCorrect ? 'Correct !!' : 'Incorrect !!'}
                </Text>
              </View>
            )}
            <View style={[styles.tabs]}>
              {Array.from(
                {length: totalModule > 30 ? 30 : totalModule},
                (_, i) => {
                  const bg =
                    i < moduleIndex
                      ? 'white'
                      : i === moduleIndex
                      ? '#F2B559'
                      : '#258F78';
                  return <Dotline key={i} bg={bg} />;
                },
              )}
              {totalModule && (
                <Text
                  style={[
                    styles.fonts_SVN_Cherish,
                    {color: COLORS.WHITE, marginRight: scale(10)},
                  ]}>
                  +{totalModule - moduleIndex}
                </Text>
              )}
            </View>
          </View>
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
  return <View style={[styles.dotline, {backgroundColor: bg, opacity: 0}]} />;
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
    height: '50%',
  },
  bookView: {
    height: '100%',
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
    paddingBottom: verticalScale(32),
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
    fontSize: scale(30),
    color: COLORS.GREEN_1C6349,
  },
  alightEnd: {
    alignItems: 'flex-end',
  },
  textModule: {
    fontSize: scale(10),
    color: COLORS.BLUE_258F78,
    maxWidth: scale(150),
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
    // padding: scale(16),
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
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(24),
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
  wrapCorrectContainer: {
    backgroundColor: '#FBF8CC',
    marginBottom: 8,
    padding: 16,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  correctTitle: {
    color: '#1C6A59',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  wrapDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  wrapImageContainer: {height: 150, width: 100},
  imageContainer: {
    height: 200,
    width: 200,
    position: 'absolute',
    left: -24,
  },
});
