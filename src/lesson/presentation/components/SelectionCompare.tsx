/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  StyleProp,
} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import TextFraction from './TextFraction';

interface SelectionCompareProps {
  question?: React.ReactNode;
  answer: string[];
  textCompare?: string;
  onSelectAnswer: (selected: string[]) => void;
  learningTimer: number;
  contentAnswer?: (e: string) => React.ReactNode;
  fontFamily?: FontFamily;
  questionStyle?: StyleProp<TextStyle>;
  answerStyle?: StyleProp<TextStyle>;
}

export interface SelectionCompareRef {
  getSelectedAnswers: () => string[];
  resetAnswerSelected: () => void;
  handleSelectAnswer: (e: string) => void;
}

const SelectionCompare: ForwardRefRenderFunction<
  SelectionCompareRef,
  SelectionCompareProps
> = (props, ref) => {
  const {
    question,
    answer,
    textCompare = '<',
    onSelectAnswer,
    learningTimer,
    contentAnswer,
    fontFamily,
    answerStyle,
  } = props;

  const [answerSelected, setAnswerSelected] = useState<string[]>(
    Array.from({length: answer.length}, (_, __) => ''),
  );
  const isOneWord = !answer.some(item => item.includes('/'));

  const handleSelectAnswer = (e: string) => {
    setAnswerSelected(prev => {
      const firstEmpty = prev.findIndex(item => item === '');
      const newSelected = prev.includes(e)
        ? prev.map(item => (item !== e ? item : ''))
        : prev.map((item, index) => (index === firstEmpty ? e : item));
      onSelectAnswer(newSelected.filter(item => item !== ''));
      return newSelected;
    });
  };

  useImperativeHandle(ref, () => ({
    getSelectedAnswers: () => answerSelected,
    resetAnswerSelected: () => setAnswerSelected([]),
    handleSelectAnswer,
  }));

  useEffect(() => {
    if (answerSelected.length === 0) {
      setAnswerSelected(Array.from({length: answer.length}, (_, __) => ''));
    }
  }, [answer, answerSelected]);

  return (
    <View style={[styles.boxSelected]}>
      {question && <View style={styles.wrapCharContainer}>{question}</View>}
      <View style={[styles.wapper, {width: '100%'}]}>
        {answer?.map((e, i) => {
          const bg = '#F2B559';
          const size = scale(56);

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
                  numberOfLines={isOneWord ? 1 : undefined}
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
      <View style={[styles.wapper, {width: '100%'}]}>
        {answerSelected?.flatMap((e, i) => {
          const bg = e === '' ? 'transparent' : '#F2B559';
          const bc = e === '' ? '#F2B559' : 'transparent';
          const size = scale(56);

          const minHeight =
            answer.length === 3 ? verticalScale(44) : verticalScale(56);

          const compareText =
            i > 0 ? (
              <View style={styles.textCompareContainer}>
                <Text style={styles.textCompare}>{textCompare}</Text>
              </View>
            ) : null;

          const item =
            e.includes('/') || e === '' ? (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelectAnswer(e)}
                style={[
                  styles.boxVowel,
                  {
                    minHeight,
                    backgroundColor: bg,
                    width: size,
                    borderWidth: 2,
                    borderColor: bc,
                    borderStyle: 'dashed',
                    margin: scale(8), // Add spacing for clarity
                  },
                ]}>
                {contentAnswer?.(e) ?? (
                  <TextFraction
                    numerator={+e.split('/')[0]}
                    denominator={+e.split('/')[1]}
                    textStyle={[
                      answerStyle,
                      e === '' ? {color: 'transparent'} : {},
                    ]}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelectAnswer(e)}
                style={[
                  styles.boxVowel,
                  {
                    minHeight,
                    backgroundColor: bg,
                    width: size,
                    borderWidth: 2,
                    borderColor: bc,
                    borderStyle: 'dashed',
                    margin: scale(4), // Add spacing for clarity
                  },
                ]}>
                {contentAnswer?.(e) ?? (
                  <Text
                    allowFontScaling
                    adjustsFontSizeToFit
                    numberOfLines={isOneWord ? 1 : undefined}
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

          return [compareText, item];
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
  textCompareContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCompare: {
    fontSize: moderateScale(28),
    textAlign: 'center',
    color: '#9587EC',
    fontWeight: 'bold',
  },
  wapper: {
    // Add your styles here
    marginTop: scale(8),
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
});

export default forwardRef(SelectionCompare);
