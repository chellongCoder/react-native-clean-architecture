import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import BookView from '../../components/BookView';
import {assets, WIDTH_SCREEN} from 'src/core/presentation/utils';
import {COLORS} from 'src/core/presentation/constants/colors';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import CustomSwitchNew from 'src/home/presentation/components/CustomSwitchNew';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import HintButton from 'src/core/components/hint/HintButton';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {Instruction} from 'src/home/application/types/GetListQuestionResponse';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import FastImage, {Source} from 'react-native-fast-image';

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
  prompt?: Instruction | string;
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
  const [source, setSource] = useState<number | Source | undefined>({
    uri: backgroundImage,
  });
  
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  const handleError = () => {
    setSource(assets.background_vowels);
  };

  const handleScrollBegin = () => {
    // User started scrolling - cancel any pending hide
    isScrollingRef.current = true;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleScrollEnd = () => {
    // User stopped scrolling - hide prompt after 1 second
    isScrollingRef.current = false;
    hideTimeoutRef.current = setTimeout(() => {
      setIsShowPrompt(false);
    }, 1000);
  };

  useEffect(() => {
    setIsShowPrompt(true);
    setTimeout(() => {
      if (!isScrollingRef.current) {
        setIsShowPrompt(false);
      }
    }, 3000);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [moduleIndex]);

  return (
    <View style={[styles.screen, {paddingTop: 0, backgroundColor}]}>
      <View style={styles.fill}>
        <FastImage
          onError={handleError}
          source={source}
          style={[StyleSheet.absoluteFill, {marginBottom: -verticalScale(30)}]}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{height: insets.top}} />
        <View
          style={[
            styles.rowBetween,
            {
              alignItems: 'flex-start',
              marginHorizontal: scale(10),
            },
          ]}>
          <View
            style={[
              styles.rowBetween,
              {
                alignItems: 'center',
              },
            ]}>
            <Text
              numberOfLines={1}
              style={[
                styles.fonts_SVN_Cherish,
                styles.textTitle,
                {
                  color: lessonSetting?.backgroundButtonColor,
                  maxWidth: module.length > 20 ? WIDTH_SCREEN / 4 : '100%',
                },
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
            <View style={{maxWidth: WIDTH_SCREEN / 2}}>
              <Text
                adjustsFontSizeToFit
                style={[
                  globalStyle.txtButton,
                  styles.textModule,
                  {color: lessonSetting?.backgroundButtonColor},
                ]}
                numberOfLines={2}>
                {module}
              </Text>
              <Text
                adjustsFontSizeToFit
                style={[
                  globalStyle.txtNote,
                  styles.textPart,
                  {color: lessonSetting?.backgroundButtonColor},
                ]}
                numberOfLines={2}>
                {part}
              </Text>
            </View>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            {txtCountDown && (
              <View style={styles.countDown}>
                <FastImage
                  style={StyleSheet.absoluteFill}
                  resizeMode={FastImage.resizeMode.contain}
                  source={assets.drug_bg}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  allowFontScaling
                  style={styles.txtCountDown}>
                  {txtCountDown}
                </Text>
              </View>
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
          <View style={[styles.boxQuestion, !isShowPrompt && {zIndex: 999}]}>
            {buildQuestion}
          </View>
        )}
        <View style={styles.wrapDescriptionContainer}>
          <View style={[styles.wrapImageContainer, characterStyle]}>
            <FastImage
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
            {isShowPrompt && (
              <>
                {typeof prompt === 'object' && prompt?.description ? (
                  <ScrollView
                    style={styles.wrapCorrectContainer}
                    contentContainerStyle={styles.scrollContentContainer}
                    showsVerticalScrollIndicator={false}
                    onScrollBeginDrag={handleScrollBegin}
                    onScrollEndDrag={handleScrollEnd}
                    onMomentumScrollEnd={handleScrollEnd}
                    nestedScrollEnabled={true}>
                    <View style={[{flexDirection: 'row', maxWidth: '100%'}]}>
                      {prompt.number !== undefined && (
                        <View style={[styles.promptNumberBg]}>
                          <Text style={[styles.promptNumber]}>
                            {prompt?.number}
                          </Text>
                        </View>
                      )}
                      {!!prompt?.content && (
                        <Text style={[styles.promptContent]}>
                          {prompt?.content}
                        </Text>
                      )}
                      <Text style={[styles.promptTitle]}>
                        {prompt?.description}
                      </Text>
                    </View>
                  </ScrollView>
                ) : typeof prompt === 'string' ? (
                  <ScrollView
                    style={styles.wrapCorrectContainer}
                    contentContainerStyle={styles.scrollContentContainer}
                    showsVerticalScrollIndicator={false}
                    onScrollBeginDrag={handleScrollBegin}
                    onScrollEndDrag={handleScrollEnd}
                    onMomentumScrollEnd={handleScrollEnd}
                    nestedScrollEnabled={true}>
                    <Text
                      style={[
                        styles.promptContent,
                        {color: lessonSetting?.backgroundButtonColor},
                      ]}>
                      {prompt as string}
                    </Text>
                  </ScrollView>
                ) : null}
              </>
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
      </View>
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
    backgroundColor: COLORS.GREEN_66C270,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textTitle: {
    fontSize: scale(30),
    color: COLORS.GREEN_1C6349,
  },
  textModule: {
    fontSize: scale(10),
    color: COLORS.BLUE_258F78,
  },
  textPart: {
    fontSize: moderateScale(8),
    color: COLORS.BLUE_258F78,
    fontWeight: '300',
  },
  boxQuestion: {
    flex: 1,
    alignItems: 'center',
    // zIndex: 999,
  },
  boxAnswer: {
    flex: 1,
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(10),
  },
  dotline: {
    height: 6,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 3,
  },
  tabs: {
    flexDirection: 'row',
    paddingBottom: verticalScale(14),
  },
  wrapCorrectContainer: {
    maxWidth: '100%',
    maxHeight: verticalScale(100), // Add max height for scrolling
    marginRight: scale(8),
    backgroundColor: COLORS.CUSTOM(COLORS.WHITE_FBF8CC, 0.4),
    padding: scale(12),
    borderTopLeftRadius: scale(36),
    borderTopRightRadius: scale(36),
    borderBottomRightRadius: scale(36),
    alignSelf: 'flex-start',
    zIndex: 998,
  },
  scrollContentContainer: {
    alignItems: 'center',
    flexGrow: 1,
  },
  correctTitle: {
    color: COLORS.GREEN_1C6A59,
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
    fontSize: scale(18),
  },
  promptContent: {
    color: COLORS.GREEN_1C6A59,
    fontFamily: FontFamily.SVNNeuzeitBold,
    maxWidth: '38%',
    marginRight: scale(6),
    fontSize: scale(11),
    zIndex: 998,
  },
  promptTitle: {
    color: COLORS.GREEN_1C6A59,
    fontSize: scale(10),
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
