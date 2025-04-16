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
  StyleProp,
  ViewStyle,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';

interface SelectionLetterQuestionProps {
  question?: React.ReactNode;
  answer: string[];
  fullAnswer: string;
  isShowCorrectContainer: boolean;
  isAnswerCorrect: boolean;
  onSelectAnswer: (selected: string[]) => void;
  learningTimer: number;
  isKeyboard?: boolean;
  contentAnswer?: (e: string) => React.ReactNode;
  fontFamily?: FontFamily;
}

export interface SelectionLetterQuestionRef {
  getSelectedAnswers: () => string[];
  resetAnswerSelected: () => void;
  // handleSelectAnswer: (e: string) => void;
}

const SelectionLetterQuestion: ForwardRefRenderFunction<
  SelectionLetterQuestionRef,
  SelectionLetterQuestionProps
> = (props, ref) => {
  const {
    question,
    answer,
    fullAnswer,
    isShowCorrectContainer,
    isAnswerCorrect,
    onSelectAnswer,
    learningTimer,
    isKeyboard,
    contentAnswer,
    fontFamily,
  } = props;

  const [answerSelected, setAnswerSelected] = useState<string[]>([]);

  useEffect(() => {
    onSelectAnswer(answerSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerSelected]);

  useImperativeHandle(ref, () => ({
    getSelectedAnswers: () => answerSelected,
    resetAnswerSelected: () => setAnswerSelected([]),
  }));

  const buildItem = ({
    e,
    i,
    style,
    isSelected,
    onPress,
  }: {
    e: string;
    i: number;
    style: StyleProp<ViewStyle>;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const bg = isSelected ? '#F2B559' : COLORS.WHITE_FBF8CC;

    const color = '#258F78';

    return (
      <TouchableOpacity
        key={i}
        onPress={onPress}
        style={[
          styles.boxVowel,
          {
            backgroundColor: bg,
            borderWidth: 2,
            borderColor: '#F2B559',
            // width: size,
            margin: scale(4), // Add spacing for clarity
          },
          style,
        ]}>
        {contentAnswer?.(e) ?? (
          <Text
            style={[
              styles.textVowel,
              fontFamily && {fontFamily},
              {
                color,
                marginTop: e === '․' ? scale(-32) : scale(0),
              },
            ]}>
            {e}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.boxSelected]}>
      <View style={styles.wrapCharContainer}>{question}</View>
      <Text style={[{fontSize: scale(20), color: '#258F78'}]}>
        {answerSelected[0] ?? '_'} {answerSelected[1] ?? '_'}
      </Text>
      <View style={[styles.row, {width: '100%'}]}>
        {buildItem({
          e: answer[0],
          i: 0,
          style: {height: scale(130), width: scale(140)},
          isSelected: answerSelected.length > 0,
          onPress: () => {
            if (answerSelected.length === 0) {
              setAnswerSelected([answer[0]]);
            }
          },
        })}
        <View
          style={[
            {flexDirection: answer[2] === '․' ? 'column' : 'column-reverse'},
          ]}>
          {buildItem({
            e: answer[1],
            i: 1,
            style: {marginLeft: scale(4), height: scale(78)},
            isSelected: answerSelected.length === 2,
            onPress: () => {
              if (answerSelected.length === 1) {
                setAnswerSelected(prev => [...prev, answer[1]]);
              }
            },
          })}
          {buildItem({
            e: answer[2],
            i: 2,
            style: {marginLeft: scale(4), height: scale(44)},
            isSelected:
              answerSelected.length === 2 &&
              answerSelected.join('') === fullAnswer,
            onPress: () => {
              if (answerSelected.length === 2) {
                setAnswerSelected(fullAnswer.split(''));
              }
            },
          })}
        </View>
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
  row: {
    // Add your styles here
    marginTop: scale(8),
    flexDirection: 'row',
    justifyContent: 'center',
    // alignSelf: 'center',
  },
  fill: {
    // Add your styles here
    flex: 1,
  },
  boxVowel: {
    // Add your styles here
    width: scale(56),
    // minHeight: scale(56),
    borderRadius: scale(10),
    justifyContent: 'center',
  },
  textVowel: {
    // Add your styles here
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: '#FBF8CC',
    fontSize: verticalScale(50),
    flexWrap: 'wrap',
    textAlign: 'center',
  },
});

export default forwardRef(SelectionLetterQuestion);
