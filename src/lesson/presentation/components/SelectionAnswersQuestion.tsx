import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {s, scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';

interface SelectionAnswersQuestionProps {
  question: React.ReactNode;
  answer: string[];
  isShowCorrectContainer: boolean;
  isAnswerCorrect: boolean;
  onSelectAnswer: (selected: string[]) => void;
  learningTimer: number;
}

interface SelectionAnswersQuestionRef {
  getSelectedAnswers: () => string[];
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
  } = props;

  const [answerSelected, setAnswerSelected] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    getSelectedAnswers: () => answerSelected,
  }));

  const handleSelectAnswer = (e: string) => {
    setAnswerSelected(prev => {
      const newSelected = prev.includes(e)
        ? prev.filter(item => item !== e)
        : [...prev, e];
      onSelectAnswer(newSelected);
      return newSelected;
    });
  };

  return (
    <View style={[styles.boxSelected]}>
      <View style={styles.wrapCharContainer}>{question}</View>
      <View style={[styles.wapper, {width: '90%'}]}>
        {answer?.map((e, i) => {
          const bg =
            Array.isArray(answerSelected) && answerSelected.includes(e)
              ? isShowCorrectContainer && !isAnswerCorrect
                ? '#F28759'
                : '#66C270'
              : '#F2B559';
          const length = answer?.length ?? 2;
          const size = Math.min(
            (WIDTH_SCREEN - scale(160)) / Math.ceil(length / 2),
            verticalScale(72),
          );

          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelectAnswer(e)}
              style={[
                styles.boxVowel,
                {
                  backgroundColor: bg,
                  height: size,
                  width: size,
                  margin: scale(8), // Add spacing for clarity
                },
              ]}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[styles.textVowel]}>
                {e}
              </Text>
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
    flexWrap: 'wrap-reverse', // Add this to enable wrapping
    flexGrow: 0.5,
  },
  fill: {
    // Add your styles here
    flex: 1,
  },
  boxVowel: {
    // Add your styles here
    width: scale(56),
    height: scale(56),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(6),
    marginVertical: scale(6),
  },
  textVowel: {
    // Add your styles here
    fontFamily: FontFamily.SVNCherishMoment,
    color: '#FBF8CC',
    fontSize: verticalScale(28),
  },
});

export default forwardRef(SelectionAnswersQuestion);
