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
  ViewStyle,
} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';
import TextFraction from './TextFraction';
import FastImage from 'react-native-fast-image';

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
  answerIsImage?: boolean;
  answerImage?: string[];
  answerDescription?: string[];
  styleItem?: StyleProp<ViewStyle>;
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
    answerIsImage,
    answerImage,
    styleItem,
    answerDescription,
  } = props;
  const [answerSelected, setAnswerSelected] = useState<string[]>([]);
  const isOneWord = !answer?.some(
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

          const minHeight =
            answer.length === 3 ? verticalScale(44) : verticalScale(56);
          if (
            e.includes('/') &&
            e.split('/').every(num => !isNaN(Number(num.trim())))
          ) {
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
                  styleItem,
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
          } else if (answerIsImage) {
            const isRightSide = i % 2 !== 0;
            return (
              <>
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSelectAnswer(e)}
                  style={[
                    styles.boxVowel,
                    styles.boxImage,
                    {
                      minHeight,
                      backgroundColor: bg,
                      width: size,
                      margin: scale(4),
                      padding: scale(4),
                      flexDirection: isRightSide ? 'row-reverse' : 'row',
                    },
                  ]}>
                  <FastImage
                    source={{
                      uri: answerImage?.[i],
                    }}
                    style={{
                      height: minHeight,
                      width: size / 2,
                      position: 'absolute',
                    }}
                  />
                  {answerDescription ? (
                    <View style={{position: 'absolute', bottom: -40}}>
                      <Text style={styles.imageDescription}>
                        {answerDescription?.[i]}
                      </Text>
                    </View>
                  ) : (
                    <View style={{flex: 1}}>
                      <Text
                        allowFontScaling
                        adjustsFontSizeToFit
                        style={[
                          styles.textVowel,
                          fontFamily && {fontFamily},
                          answerStyle,
                          {textAlign: isRightSide ? 'right' : 'left'},
                        ]}>
                        {e
                          .replace(/\s*-\s*/, '-')
                          .replace(/(?<!\S)\s+(?!\S)/g, '\n')
                          .trim()}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </>
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
                styleItem,
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
                    .replace(/\s*-\s*/, '-')
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
    paddingTop: verticalScale(8),
  },
  wapper: {
    // Add your styles here
    marginTop: verticalScale(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap', // Add this to enable wrapping
  },
  boxVowel: {
    // Add your styles here
    width: scale(56),
    minHeight: verticalScale(56),
    maxHeight: verticalScale(76),
    borderRadius: scale(10),
    justifyContent: 'center',
  },
  textVowel: {
    // Add your styles here
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: COLORS.WHITE_FBF8CC,
    fontSize: moderateScale(14),
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  boxImage: {
    flexDirection: 'row',
  },
  imageDescription: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.YELLOW_F2B559,
    textAlign: 'center',
  },
});

export default forwardRef(SelectionAnswersQuestion);
