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
import {WIDTH_SCREEN} from 'src/core/presentation/utils';
import TextFraction from './TextFraction';

interface SelectionAnswersQuestionProps {
  question?: React.ReactNode;
  answer: string[];
  isShowCorrectContainer: boolean;
  isAnswerCorrect: boolean;
  onSelectAnswer: (selected: string[]) => void;
  learningTimer: number;
  isKeyboard?: boolean;
  isSelectOne?: boolean;
  contentAnswer?: (e: string) => React.ReactNode;
  fontFamily?: FontFamily;
  questionStyle?: StyleProp<TextStyle>;
  answerStyle?: StyleProp<TextStyle>;
}

export interface SelectionAnswersQuestionRef {
  getSelectedAnswers: () => string[];
  resetAnswerSelected: () => void;
  handleSelectAnswer: (e: string) => void;
}

const SelectionAnswersQuestion: ForwardRefRenderFunction<
  SelectionAnswersQuestionRef,
  SelectionAnswersQuestionProps
> = (props, ref) => {
  const {
    question,
    answer,
    isShowCorrectContainer,
    isAnswerCorrect,
    onSelectAnswer,
    learningTimer,
    isKeyboard,
    isSelectOne,
    contentAnswer,
    fontFamily,
    answerStyle,
  } = props;

  const [answerSelected, setAnswerSelected] = useState<string[]>([]);
  const isOneWord = !answer.some(
    item => item.includes('/') || item.includes(' '),
  );

  const handleSelectAnswer = (e: string) => {
    if (isSelectOne) {
      setAnswerSelected(_ => {
        const newSelected: string[] = [e];
        onSelectAnswer(newSelected);
        return newSelected;
      });
      return;
    }
    if (isKeyboard) {
      setAnswerSelected(prev => {
        const newSelected = [...prev, e];
        onSelectAnswer(newSelected);
        return newSelected;
      });
    } else {
      setAnswerSelected(prev => {
        const newSelected = prev.includes(e)
          ? prev.filter(item => item !== e)
          : [...prev, e];
        onSelectAnswer(newSelected);
        return newSelected;
      });
    }
  };

  useImperativeHandle(ref, () => ({
    getSelectedAnswers: () => answerSelected,
    resetAnswerSelected: () => setAnswerSelected([]),
    handleSelectAnswer,
  }));

  return (
    <View style={[styles.boxSelected]}>
      {question && <View style={styles.wrapCharContainer}>{question}</View>}
      <View style={[styles.wapper, {width: '100%'}]}>
        {answer?.map((e, i) => {
          const bg =
            Array.isArray(answerSelected) &&
            answerSelected.includes(e.trim()) &&
            !isKeyboard
              ? isShowCorrectContainer && !isAnswerCorrect
                ? '#F28759'
                : '#66C270'
              : '#F2B559';
          const length = answer?.length ?? 2;
          const size =
            answer.length === 3
              ? WIDTH_SCREEN - scale(100)
              : (WIDTH_SCREEN - scale(100)) /
                (answer.length > 3 ? Math.ceil(length / 2) : 2);

          const minHeight = answer.length === 3 ? scale(44) : scale(56);
          if (e.includes('/')) {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelectAnswer(e)}
                style={[
                  styles.boxVowel,
                  {
                    minHeight,
                    backgroundColor: bg,
                    width: size,
                    margin: scale(4), // Add spacing for clarity
                  },
                ]}>
                {contentAnswer?.(e) ?? (
                  <TextFraction
                    numerator={+e.split('/')[0]}
                    denominator={+e.split('/')[1]}
                    textStyle={answerStyle}
                  />
                )}
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelectAnswer(e)}
              style={[
                styles.boxVowel,
                {
                  minHeight,
                  backgroundColor: bg,
                  width: size,
                  margin: scale(4), // Add spacing for clarity
                },
              ]}>
              {contentAnswer?.(e) ?? (
                <Text
                  allowFontScaling
                  adjustsFontSizeToFit
                  numberOfLines={isOneWord ? 1 : 2}
                  style={[
                    styles.textVowel,
                    fontFamily && {fontFamily},
                    answerStyle,
                  ]}>
                  {e
                    .replace(/\s*-\s*/, '')
                    .replace(/(?<!\S)\s+(?!\S)/g, '\n')
                    .trim()}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {learningTimer !== 0 && (
        <View
          style={[
            styles.boxSelected,
            {
              position: 'absolute',
              zIndex: 999,
              width: '100%',
              opacity: 0.7,
              height: '100%',
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  boxSelected: {
    // Add your styles here
    backgroundColor: COLORS.WHITE_FBF8CC,
    height: verticalScale(220),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapCharContainer: {
    // Add your styles here
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingTop: scale(8),
  },
  fonts_SVN_Neu: {
    // Add your styles here
    fontFamily: FontFamily.SVNNeuzeitRegular,
  },
  textQuestion: {
    // Add your styles here
    fontSize: verticalScale(34),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
  },
  textGreen: {
    // Add your styles here
    color: COLORS.BLUE_258F78,
  },
  mt8: {
    // Add your styles here
    marginTop: verticalScale(8),
  },
  wapper: {
    // Add your styles here
    marginTop: scale(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap', // Add this to enable wrapping
  },
  fill: {
    // Add your styles here
    flex: 1,
  },
  boxVowel: {
    // Add your styles here
    width: scale(56),
    minHeight: scale(56),
    maxHeight: scale(76),
    borderRadius: scale(10),
    justifyContent: 'center',
  },
  textVowel: {
    // Add your styles here
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: COLORS.WHITE_FBF8CC,
    fontSize: verticalScale(14),
    flexWrap: 'wrap',
    textAlign: 'center',
  },
});

export default forwardRef(SelectionAnswersQuestion);
