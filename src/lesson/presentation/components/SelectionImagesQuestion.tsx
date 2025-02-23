import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';

interface SelectionAnswersQuestionProps {
  question?: React.ReactNode;
  answers: string[];
  isShowCorrectContainer: boolean;
  isAnswerCorrect: boolean;
  onSelectAnswer: (selected: string[]) => void;
  learningTimer: number;
  isKeyboard?: boolean;
  isSelectOne?: boolean;
  contentAnswer?: (e: string) => React.ReactNode;
}

export interface SelectionAnswersQuestionRef {
  getSelectedAnswers: () => string[];
  resetAnswerSelected: () => void;
  handleSelectAnswer: (e: string) => void;
}

const SelectionImagesQuestion: ForwardRefRenderFunction<
  SelectionAnswersQuestionRef,
  SelectionAnswersQuestionProps
> = (props, ref) => {
  const {
    question,
    answers,
    isShowCorrectContainer,
    isAnswerCorrect,
    onSelectAnswer,
    learningTimer,
    isKeyboard,
    isSelectOne,
    contentAnswer,
  } = props;

  const [answerSelected, setAnswerSelected] = useState<string[]>([]);
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

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
      <View style={styles.wrapCharContainer}>{question}</View>
      <View style={[styles.wapper, {width: '100%'}]}>
        {answers?.map((e, i) => {
          const bg =
            Array.isArray(answerSelected) &&
            answerSelected.includes(e.trim()) &&
            !isKeyboard
              ? isShowCorrectContainer && !isAnswerCorrect
                ? '#F28759'
                : COLORS.GREEN_66C270
              : '#F2B559';
          const length = answers?.length ?? 2;
          const size =
            answers.length > 3
              ? (WIDTH_SCREEN - scale(100)) / Math.ceil(length / 2)
              : WIDTH_SCREEN - scale(50);

          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelectAnswer(e)}
              style={[
                styles.boxVowel,
                {
                  borderColor: bg,
                  backgroundColor:
                    bg === COLORS.GREEN_66C270
                      ? COLORS.GREEN_66C270
                      : COLORS.TRANSPARENT,
                  borderWidth: 2,
                  width: size,
                  margin: scale(8), // Add spacing for clarity
                },
              ]}>
              <Image
                resizeMode={'contain'}
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: scale(20),
                }}
                source={{uri: env.IMAGE_QUESTION_BASE_API_URL + answers[i]}}
              />
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
    color: '#FBF8CC',
    fontSize: verticalScale(14),
    flexWrap: 'wrap',
    textAlign: 'center',
  },
});

export default forwardRef(SelectionImagesQuestion);
