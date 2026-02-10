import {
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {assets} from 'src/core/presentation/utils';
import {COLORS} from 'src/core/presentation/constants/colors';
import {scale} from 'react-native-size-matters';
import {SafeAreaView} from 'react-native-safe-area-context';
import {goBack} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import LinearGradient from 'react-native-linear-gradient';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {useI18n} from 'src/core/presentation/hooks/useI18n';

const {width} = Dimensions.get('window');

const bgGradientColors = [
  '#8DE795',
  '#68D24C',
  '#4CB572',
  '#48B472',
  '#21A770',
  '#099F6F',
  '#009C6F',
];

const TutorialSlideScreen = () => {
  const i18n = useI18n();

  const slides = [
    {
      id: '1',
      title: i18n.t('lesson.screens.Introduction.chooseAccount') as string,
      content: i18n.t(
        'lesson.screens.Introduction.contentChooseAccount',
      ) as string,
      image: assets.tutorial_1,
    },
    {
      id: '2',
      title: i18n.t('lesson.screens.Introduction.chooseApp') as string,
      content: i18n.t('lesson.screens.Introduction.contentChooseApp') as string,
      image: assets.tutorial_2,
    },
    {
      id: '3',
      title: i18n.t('lesson.screens.Introduction.setScore') as string,
      content: i18n.t('lesson.screens.Introduction.contentSetScore') as string,
      image: assets.tutorial_3,
    },
    {
      id: '4',
      title: i18n.t('lesson.screens.Introduction.chooseSubject') as string,
      content: i18n.t(
        'lesson.screens.Introduction.contentChooseSubject',
      ) as string,
      image: assets.tutorial_4,
    },
    {
      id: '5',
      title: i18n.t('lesson.screens.Introduction.finishModule') as string,
      content: i18n.t(
        'lesson.screens.Introduction.contentFinishModule',
      ) as string,
      image: assets.tutorial_5,
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const {setShowTutorial} = useHomeStore();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor((contentOffsetX + 0.5) / width);
    setCurrentSlide(index);
  };

  useEffect(() => {
    setShowTutorial(false);
  }, [setShowTutorial]);

  return (
    <ImageBackground
      style={styles.screen}
      source={assets.paymentSuccessBackground}>
      <SafeAreaView style={styles.screen}>
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}>
          {slides.map(slide => (
            <View key={slide.id} style={styles.slide}>
              <Text style={styles.title}>{slide.title}</Text>
              <View style={styles.contentBg}>
                <View style={styles.center}>
                  <Text style={styles.content}>{slide.content}</Text>
                </View>
                <Image
                  source={slide.image}
                  style={[
                    styles.image,
                    {
                      height:
                        (Image.resolveAssetSource(slide.image).height /
                          Image.resolveAssetSource(slide.image).width) *
                        (width - scale(64)),
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        {currentSlide < slides.length - 1 ? (
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentSlide === index ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={goBack}>
            <LinearGradient
              colors={bgGradientColors}
              style={[styles.backgroundGradient, styles.border]}
              start={{x: 0.5, y: 1}}
              end={{x: 0.5, y: 0}}>
              <LinearGradient
                colors={bgGradientColors}
                style={styles.backgroundGradient}
                start={{x: 0.5, y: 0}}
                locations={[0, 0.3, 0.6, 0.66, 0.8, 0.84, 1]}
                end={{x: 0.5, y: 1}}>
                <View style={[styles.paddingButton]}>
                  <Text style={styles.textButton}>ĐÃ HIỂU</Text>
                </View>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default TutorialSlideScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(16),
  },
  title: {
    fontSize: scale(32),
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: scale(6),
    color: COLORS.WHITE_FFFBE3,
  },
  contentBg: {
    flex: 1,
    backgroundColor: COLORS.WHITE_FFFBE3,
    borderRadius: scale(20),
    padding: scale(16),
    marginBottom: scale(40),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: scale(24),
    textAlign: 'center',
    color: COLORS.GREEN_009C6F,
  },
  image: {
    width: width - scale(64),
    borderRadius: scale(10),
    marginTop: scale(16),
    // resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: scale(30),
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    borderWidth: 1,
    borderColor: COLORS.WHITE_FFFBE3,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.WHITE_FFFBE3,
  },
  button: {
    position: 'absolute',
    bottom: scale(20),
    alignSelf: 'center',
    borderRadius: scale(10),
  },
  backgroundGradient: {
    flex: 1,
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  paddingButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
  },
  textButton: {
    color: COLORS.WHITE_FFFBE3,
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  border: {
    padding: 2,
  },
});
