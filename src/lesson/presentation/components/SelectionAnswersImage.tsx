import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
  useRef,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import FastImage from 'react-native-fast-image';
import {assets} from 'src/core/presentation/utils';
import ScrollIndicator from './ScrollIndicator';

interface SelectionAnswersImageProps {
  question?: React.ReactNode;
  answer: string[];
  questionImage: string[];
  isShowCorrectContainer: boolean;
  isAnswerCorrect: boolean;
  onSelectAnswer: (selected: string[]) => void;
  learningTimer: number;
  isSelectOne?: boolean;
  fontFamily?: FontFamily;
  answerStyle?: StyleProp<TextStyle>;
  answerColors?: string[]; // Custom colors for each answer option
}

export interface SelectionAnswersImageRef {
  getSelectedAnswers: () => string[];
  resetAnswerSelected: () => void;
  handleSelectAnswer: (e: string) => void;
}

const SelectionAnswersImage: ForwardRefRenderFunction<
  SelectionAnswersImageRef,
  SelectionAnswersImageProps
> = (props, ref) => {
  const {
    question,
    answer,
    questionImage,
    isShowCorrectContainer,
    isAnswerCorrect,
    onSelectAnswer,
    learningTimer,
    isSelectOne = true,
    fontFamily,
    answerStyle,
    answerColors = ['#F2B559', '#F2B559', '#F2B559', '#F2B559'],
  } = props;

  const [answerSelected, setAnswerSelected] = useState<string[]>([]);
  const [answerSelectedIndex, setAnswerSelectedIndex] = useState<number>(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const progressRef = useRef<number>(0);

  const handleSelectAnswer = (e: string, index: number) => {
    if (isSelectOne) {
      setAnswerSelected(_ => {
        const newSelected: string[] = [e];
        onSelectAnswer(newSelected);
        return newSelected;
      });
      setAnswerSelectedIndex(index);
      return;
    }

    setAnswerSelected(prev => {
      const newSelected = prev.includes(e)
        ? prev.filter(item => item !== e)
        : [...prev, e];
      onSelectAnswer(newSelected);
      return newSelected;
    });
  };

  useImperativeHandle(ref, () => ({
    getSelectedAnswers: () => answerSelected,
    resetAnswerSelected: () => setAnswerSelected([]),
    handleSelectAnswer: (e: string) =>
      handleSelectAnswer(e, answerSelectedIndex),
  }));

  const getAnswerBackgroundColor = (answerText: string, index: number) => {
    const isSelected = answerSelected.includes(answerText.trim());

    if (isSelected) {
      if (isShowCorrectContainer && !isAnswerCorrect) {
        return '#F28759'; // Error color when wrong answer is selected
      }
      return '#66C270'; // Success color when selected
    }

    // Use custom colors for unselected answers or default color
    return answerColors[index] || '#F2B559';
  };

  // Create a low-quality version of the image URL (if your server supports it)
  const getLowQualityImageUrl = (url: string) => {
    // Example: append quality parameter if your server supports it
    return url + '?quality=20&blur=5';
  };

  return (
    <View style={styles.container}>
      {question && <View style={styles.questionContainer}>{question}</View>}

      <ScrollIndicator containerStyle={{width: '100%'}}>
        <View style={styles.contentContainer}>
          {/* Left side - Question Image */}
          <View style={styles.imageContainer}>
            {/* Low quality placeholder */}
            {isImageLoading && (
              <FastImage
                source={{
                  uri: getLowQualityImageUrl(
                    questionImage[answerSelectedIndex],
                  ),
                }}
                style={[styles.questionImage, styles.blurredImage]}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}

            {/* High quality image */}
            <FastImage
              source={
                imageLoadError
                  ? assets.onboarding
                  : {
                      uri: questionImage[answerSelectedIndex],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }
              }
              style={[styles.questionImage, {opacity: isImageLoading ? 0 : 1}]}
              resizeMode={FastImage.resizeMode.cover}
              onLoadStart={() => {
                if (progressRef.current === -0) {
                  return;
                }
                setIsImageLoading(true);
                setImageLoadError(false);
              }}
              onProgress={e => {
                // Show loading progress
                const progress = e.nativeEvent.loaded / e.nativeEvent.total;
                console.log('Image loading progress:', progress);
                progressRef.current = progress;
              }}
              onLoad={e => {
                setIsImageLoading(false);
                console.log(
                  'Image loaded:',
                  e.nativeEvent.width,
                  e.nativeEvent.height,
                );
              }}
              onLoadEnd={() => setIsImageLoading(false)}
              onError={() => {
                setIsImageLoading(false);
                setImageLoadError(true);
              }}
              // Optional: fallback to regular Image component if needed
              fallback={false}
            />

            {/* Loading indicator */}
            {isImageLoading && (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator size="small" color={COLORS.GREEN_66C270} />
              </View>
            )}

            {/* Blur Overlay while loading */}
            {isImageLoading && (
              <View style={styles.blurOverlay}>
                <ActivityIndicator size="large" color={COLORS.GREEN_66C270} />
              </View>
            )}
          </View>

          {/* Right side - Answer Options */}
          <View style={styles.answersContainer}>
            {answer?.map((answerText, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectAnswer(answerText, index)}
                style={[
                  styles.answerButton,
                  {
                    backgroundColor: getAnswerBackgroundColor(
                      answerText,
                      index,
                    ),
                  },
                ]}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.answerText,
                    fontFamily && {fontFamily},
                    answerStyle,
                  ]}>
                  {answerText.trim()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollIndicator>

      {/* Learning Timer Overlay */}
      {learningTimer !== 0 && <View style={styles.timerOverlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    height: verticalScale(220),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  questionContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: scale(16),
  },
  imageContainer: {
    flex: 1,
    borderRadius: scale(15),
    overflow: 'hidden',
    minHeight: verticalScale(150),
  },
  questionImage: {
    width: '100%',
    height: '100%',
  },
  answersContainer: {
    flex: 1,
    gap: scale(4),
    minHeight: verticalScale(150),
  },
  answerButton: {
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  answerText: {
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: COLORS.WHITE_FBF8CC,
    fontSize: 16,
    textAlign: 'center',
  },
  timerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: scale(30),
    zIndex: 999,
  },
  blurredImage: {
    position: 'absolute',
    opacity: 0.7,
  },

  loadingIndicator: {
    position: 'absolute',
    bottom: scale(8),
    right: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: scale(12),
    padding: scale(4),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(15),
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(15),
  },
});

export default forwardRef(SelectionAnswersImage);
