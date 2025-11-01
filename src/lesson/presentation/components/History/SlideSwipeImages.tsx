import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';

const {width: screenWidth} = Dimensions.get('window');

interface SlideItem {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

interface SlideSwipeImagesProps {
  data: SlideItem[];
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  showPagination?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  loop?: boolean;
  onSlideChange?: (index: number) => void;
  onSlidePress?: (item: SlideItem, index: number) => void;
  sliderWidth?: number;
  itemWidth?: number;
  backgroundColor?: string;
  showSwipeHint?: boolean;
}

const SlideSwipeImages: React.FC<SlideSwipeImagesProps> = ({
  data,
  containerStyle,
  imageStyle,
  titleStyle,
  subtitleStyle,
  showPagination = true,
  autoPlay = false,
  autoPlayDelay = 3000,
  loop = true,
  onSlideChange,
  onSlidePress,
  sliderWidth = screenWidth * 0.8,
  itemWidth = screenWidth * 0.5,
  backgroundColor = '',
  showSwipeHint = true,
}) => {
  const carouselRef = useRef<Carousel<SlideItem>>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (autoPlay && data.length > 1) {
      const interval = setInterval(() => {
        if (carouselRef.current) {
          const nextIndex = loop
            ? (activeSlide + 1) % data.length
            : Math.min(activeSlide + 1, data.length - 1);
          carouselRef.current.snapToItem(nextIndex);
        }
      }, autoPlayDelay);

      return () => clearInterval(interval);
    }
  }, [activeSlide, autoPlay, autoPlayDelay, loop, data.length]);

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
    onSlideChange?.(index);
  };

  const renderSlideItem = ({item, index}: {item: SlideItem; index: number}) => {
    return (
      <View pointerEvents='none' style={{flexDirection: 'column', gap: scale(4)}}>
        <View>
          {item.title && (
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              style={[styles.title, titleStyle]}>
              {item.title}
            </Text>
          )}
          {item.subtitle && (
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              allowFontScaling
              style={[styles.subtitle, subtitleStyle]}>
              {item.subtitle}
            </Text>
          )}
        </View>
        <View
          style={[styles.slideContainer, imageStyle]}>
          <View style={styles.imageContainer}>
            <FastImage
              source={{uri: item.imageUrl}}
              style={styles.slideImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </View>
      </View>
    );
  };

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, {backgroundColor}, containerStyle]}>
        <Text style={styles.noDataText}>No images to display</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor}, containerStyle]}>
      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          data={data}
          renderItem={renderSlideItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={handleSlideChange}
          loop={loop}
          loopClonesPerSide={loop ? 2 : 0}
          autoplay={autoPlay}
          autoplayDelay={autoPlayDelay}
          autoplayInterval={autoPlayDelay}
          enableMomentum={false}
          lockScrollWhileSnapping={true}
          useScrollView={true}
          activeSlideAlignment="center"
          inactiveSlideScale={0.85}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.carouselWrapper}
          contentContainerCustomStyle={styles.carouselContent}
        />
      </View>

      {/* Pagination */}

      {/* Swipe hint */}
      {showSwipeHint && (
        <View style={styles.swipeHintContainer}>
          <Text style={styles.swipeHintText}>Swipe to continue</Text>
          <Text style={styles.swipeHintEmoji}>👉</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: scale(20),
    // paddingHorizontal: scale(16),
    // justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  mainTitle: {
    fontSize: scale(32),
    fontFamily: FontFamily.SVNCherishMoment,
    color: '#E67E22',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: scale(2),
  },
  mainSubtitle: {
    fontSize: scale(28),
    fontFamily: FontFamily.SVNCherishMoment,
    color: '#E67E22',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: scale(1),
    marginTop: scale(4),
  },
  description: {
    fontSize: scale(18),
    fontFamily: FontFamily.Eina01Regular,
    color: '#52C4A0',
    textAlign: 'center',
    marginTop: scale(12),
    lineHeight: scale(24),
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselWrapper: {
    flex: 1,
  },
  carouselContent: {},
  slideContainer: {
    height: verticalScale(120),
    borderRadius: scale(20),
    overflow: 'hidden',
    borderColor: COLORS.WHITE_FBF8CC,
    borderWidth: 2,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
  },
  title: {
    fontSize: scale(18),
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.WHITE_FBF8CC,
    textAlign: 'center',
    marginBottom: scale(4),
  },
  subtitle: {
    fontSize: scale(14),
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: COLORS.WHITE_FBF8CC,
    textAlign: 'center',
    opacity: 0.9,
  },
  paginationContainer: {
    // paddingTop: scale(16),
    // paddingBottom: 0,
    // height: 20
  },
  paginationDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: '#E67E22',
    marginHorizontal: scale(4),
  },
  paginationInactiveDot: {
    backgroundColor: 'rgba(230, 126, 34, 0.3)',
  },
  swipeHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeHintText: {
    fontSize: scale(12),
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: '#E67E22',
    marginRight: scale(8),
  },
  swipeHintEmoji: {
    fontSize: scale(20),
  },
  noDataText: {
    fontSize: scale(16),
    fontFamily: FontFamily.Eina01Regular,
    color: COLORS.WHITE_FBF8CC,
    textAlign: 'center',
  },
});

export default SlideSwipeImages;
