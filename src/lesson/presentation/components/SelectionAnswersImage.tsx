import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  StyleProp,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import FastImage from 'react-native-fast-image';

interface SelectionAnswersImageProps {
  question?: React.ReactNode;
  answer: string[];
  questionImage: string;
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
    answerColors = ['#66C270', '#F2B559', '#F2B559', '#F2B559'], // Default colors
  } = props;

  const [answerSelected, setAnswerSelected] = useState<string[]>([]);

  const handleSelectAnswer = (e: string) => {
    if (isSelectOne) {
      setAnswerSelected(_ => {
        const newSelected: string[] = [e];
        onSelectAnswer(newSelected);
        return newSelected;
      });
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
    handleSelectAnswer,
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

  return (
    <View style={styles.container}>
      {question && <View style={styles.questionContainer}>{question}</View>}

      <View style={styles.contentContainer}>
        {/* Left side - Question Image */}
        <View style={styles.imageContainer}>
          <FastImage
            source={{uri: questionImage}}
            style={styles.questionImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>

        {/* Right side - Answer Options */}
        <View style={styles.answersContainer}>
          {answer?.map((answerText, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectAnswer(answerText)}
              style={[
                styles.answerButton,
                {
                  backgroundColor: getAnswerBackgroundColor(answerText, index),
                },
              ]}>
              <Text
                allowFontScaling
                adjustsFontSizeToFit
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
    padding: scale(16),
  },
  questionContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingBottom: scale(8),
    alignSelf: 'stretch',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: scale(16),
  },
  imageContainer: {
    flex: 1,
    borderRadius: scale(15),
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  questionImage: {
    width: '100%',
    height: '100%',
  },
  answersContainer: {
    flex: 1,
    justifyContent: 'space-between',
    gap: scale(8),
  },
  answerButton: {
    flex: 1,
    borderRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    minHeight: scale(40),
  },
  answerText: {
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: COLORS.WHITE_FBF8CC,
    fontSize: verticalScale(12),
    textAlign: 'center',
    lineHeight: verticalScale(16),
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
});

export default forwardRef(SelectionAnswersImage);
