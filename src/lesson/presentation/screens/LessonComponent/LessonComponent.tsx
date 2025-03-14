import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import BookView from '../../components/BookView';
import {assets, WIDTH_SCREEN} from 'src/core/presentation/utils';
import {COLORS} from 'src/core/presentation/constants/colors';
import {scale, verticalScale} from 'react-native-size-matters';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import CustomSwitchNew from 'src/home/presentation/components/CustomSwitchNew';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import HintButton from 'src/core/components/hint/HintButton';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {Instruction} from 'src/home/application/types/GetListQuestionResponse';
import {useI18n} from 'src/core/presentation/hooks/useI18n';

type Props = {
  lessonName?: string;
  module?: string;
  part?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  characterImage?: string;
  backgroundAnswerColor?: string;
  buildQuestion?: React.ReactNode;
  buildAnswer: React.ReactNode;
  moduleIndex: number;
  totalModule: number;
  price?: string;
  score?: number;
  isAnswerCorrect?: boolean;
  isShowCorrectContainer?: boolean;
  txtCountDown?: string;
  onPressFlower?: () => void;
  prompt?: Instruction;
  characterStyle?: StyleProp<ViewStyle>;
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
  characterImage,
  txtCountDown,
  prompt,
  characterStyle,
}: Props) => {
  const {lessonSetting} = useHomeStore();

  const i18n = useI18n();

  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();
  const [isShowPrompt, setIsShowPrompt] = useState(true);
  const [source, setSource] = useState<ImageSourcePropType | undefined>({
    uri: backgroundImage,
  });

  const handleError = () => {
    setSource(assets.background_vowels);
  };

  useEffect(() => {
    setIsShowPrompt(true);
    setTimeout(() => {
      setIsShowPrompt(false);
    }, 3000);
  }, [moduleIndex]);

  return (
    <View style={[styles.screen, {paddingTop: 0, backgroundColor}]}>
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
          <View
            style={[
              styles.rowBetween,
              {alignItems: 'center', maxWidth: scale(150)},
            ]}>
            <Text
              numberOfLines={1}
              style={[
                styles.fonts_SVN_Cherish,
                styles.textTitle,
                {color: lessonSetting?.backgroundButtonColor},
              ]}
              ellipsizeMode="middle">
              {lessonName}
            </Text>
            <View
              style={{
                height: verticalScale(20),
                width: scale(3),
                backgroundColor: lessonSetting?.backgroundButtonColor,
                borderRadius: scale(10),
                marginHorizontal: scale(8),
              }}
            />
            <View style={{maxWidth: scale(120)}}>
              <Text
                adjustsFontSizeToFit
                style={[
                  globalStyle.txtButton,
                  styles.textModule,
                  {color: lessonSetting?.backgroundButtonColor},
                ]}
                numberOfLines={1}>
                {module}
              </Text>
              <Text
                adjustsFontSizeToFit
                style={[
                  globalStyle.txtNote,
                  styles.textPart,
                  {color: lessonSetting?.backgroundButtonColor},
                ]}
                numberOfLines={1}>
                {part}
              </Text>
            </View>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            {txtCountDown && (
              <ImageBackground
                style={styles.countDown}
                resizeMode="contain"
                source={assets.drug_bg}>
                <Text style={styles.txtCountDown}>{txtCountDown}</Text>
              </ImageBackground>
            )}
            <View style={{height: verticalScale(5)}} />
            <TouchableOpacity onPress={onPressFlower}>
              <CustomSwitchNew
                point={score}
                value={false}
                onValueChange={() => {}}
              />
            </TouchableOpacity>
          </View>
        </View>

        {buildQuestion && (
          <View
            style={[
              styles.boxQuestion,
              styles.pb32,
              !isShowPrompt && {zIndex: 999},
            ]}>
            {buildQuestion}
          </View>
        )}
        <View style={styles.wrapDescriptionContainer}>
          <View style={[styles.wrapImageContainer, characterStyle]}>
            <Image
              source={
                characterImage
                  ? {uri: characterImage}
                  : require('../../../../../assets/images/barry_1.png')
              }
              resizeMode="contain"
              style={styles.imageContainer}
            />
          </View>

          <View style={{flex: 1}}>
            {isShowCorrectContainer && (
              <View style={styles.wrapCorrectContainer}>
                <Text style={styles.correctTitle}>
                  {isAnswerCorrect
                    ? `${i18n.t('lesson.screens.Modules.correct')} !!`
                    : `${i18n.t('lesson.screens.Modules.incorrect')} !!`}
                </Text>
              </View>
            )}
            {isShowPrompt && prompt?.description && (
              <View style={styles.wrapCorrectContainer}>
                <View style={[{flexDirection: 'row', maxWidth: '100%'}]}>
                  {prompt.number !== undefined && (
                    <View style={[styles.promptNumberBg]}>
                      <Text style={[styles.promptNumber]}>{prompt.number}</Text>
                    </View>
                  )}
                  {!!prompt.content && (
                    <Text style={[styles.promptContent]}>{prompt.content}</Text>
                  )}
                  <Text style={[styles.promptTitle, {flex: 1}]}>
                    {prompt.description}
                  </Text>
                </View>
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
          <View style={[styles.boxAnswer]}>
            <View
              style={{
                position: 'absolute',
                top: scale(5),
                left: scale(20),
              }}>
              <TouchableOpacity onPress={onPressFlower}>
                <HintButton />
              </TouchableOpacity>
            </View>
            {buildAnswer}
          </View>
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
    paddingTop: verticalScale(30),
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
    alignItems: 'center',
    // zIndex: 999,
  },
  textLarge: {
    fontSize: scale(140),
    textAlign: 'center',
    color: 'white',
  },
  textQuestion: {
    fontSize: scale(40),
    textAlign: 'center',
    color: 'white',
  },
  boxAnswer: {
    flex: 1,
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(10),
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
    maxWidth: '100%',
    marginRight: scale(8),
    backgroundColor: COLORS.CUSTOM(COLORS.WHITE_FBF8CC, 0.5),
    marginBottom: scale(8),
    padding: scale(12),
    borderTopLeftRadius: scale(36),
    borderTopRightRadius: scale(36),
    borderBottomRightRadius: scale(36),
    alignItems: 'center',
    alignSelf: 'flex-start',
    zIndex: 998,
  },
  correctTitle: {
    color: '#1C6A59',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  promptNumberBg: {
    backgroundColor: COLORS.RED_FF6347,
    marginRight: scale(6),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(32),
    height: scale(32),
    zIndex: 998,
  },
  promptNumber: {
    color: COLORS.WHITE_FBF8CC,
    fontFamily: FontFamily.SVNCherishMoment,
    fontSize: 20,
  },
  promptContent: {
    color: COLORS.GREEN_1C6A59,
    fontFamily: FontFamily.SVNCherishMoment,
    marginRight: scale(6),
    fontSize: 18,
    zIndex: 998,
  },
  promptTitle: {
    color: COLORS.GREEN_1C6A59,
    fontWeight: 'bold',
    zIndex: 998,
  },
  wrapDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  wrapImageContainer: {
    height: verticalScale(150),
    aspectRatio: 1 / 2,
    marginBottom: -verticalScale(30),
  },
  imageContainer: {
    height: '100%',
    width: '100%',
  },
  countDown: {
    width: scale(60),
    aspectRatio: 4 / 2,
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtCountDown: {
    color: COLORS.WHITE_FBF8CC,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    fontSize: scale(16),
  },
});
