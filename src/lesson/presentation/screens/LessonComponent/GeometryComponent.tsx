import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {assets} from 'src/core/presentation/utils';
import {Question} from 'src/home/application/types/GetListQuestionResponse';

type GeometryComponentProps = {
  question?: Question;
  imageUrl?: string;
  _setSelectedAnswer?: (answer: string) => void;
  onSubmit?: () => void;
  selectedAnswer: string;
};
const GeometryComponent = ({
  question,
  imageUrl,
  _setSelectedAnswer,
  onSubmit: _onSubmit,
  selectedAnswer,
}: GeometryComponentProps) => {
  const globalStyle = useGlobalStyle();
  const listAnswer = question?.answers;

  const onSelectAnswer = (item: string) => {
    _setSelectedAnswer && _setSelectedAnswer(item);
  };

  const onSubmit = useCallback(() => {
    _onSubmit?.();
  }, [_onSubmit]);

  return (
    <View style={styles.container}>
      <Text style={[globalStyle.txtLabel, styles.pb16, styles.textColor]}>
        Choose the correct answer
      </Text>

      {/* Question container */}
      <View style={styles.wrapBodyContainer}>
        {/* Image question */}
        <View style={[{flex: 1}, styles.questionContainer]}>
          <View style={{alignItems: 'center'}}>
            <Text style={[globalStyle.txtModule, styles.questionTitle]}>
              {question?.content}
            </Text>
          </View>

          <Image
            source={imageUrl ? {uri: imageUrl} : assets.rectangle}
            style={{width: scale(150), height: verticalScale(150)}}
            resizeMode="contain"
          />
        </View>

        {/* List answer */}
        <View style={[{flex: 0.7}, styles.listAnswerContainer]}>
          {listAnswer?.map(item => {
            return (
              <TouchableOpacity
                style={[
                  styles.answerContainer,
                  item.trim() === selectedAnswer.trim()
                    ? {backgroundColor: COLORS.GREEN_66C270}
                    : {},
                ]}
                onPress={() => onSelectAnswer(item)}
                disabled={item === selectedAnswer}>
                <Text style={[globalStyle.txtModule, styles.answerTitle]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Submit button container */}
      <View style={styles.wrapButtonContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onSubmit}>
          <Text style={[styles.buttonTitle, globalStyle.txtLabel]}>
            Nộp bài
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pb16: {
    paddingBottom: verticalScale(16),
  },
  textColor: {
    color: '#003C82',
  },
  wrapBodyContainer: {
    height: scale(230),
    borderRadius: scale(32),
    backgroundColor: '#FBF8CC',
    flexDirection: 'row',
    padding: scale(16),
  },
  questionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  questionTitle: {
    fontSize: 35,
    color: '#FE311F',
  },
  listAnswerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  answerContainer: {
    backgroundColor: COLORS.YELLOW_F2B559,
    borderRadius: scale(10),
    paddingVertical: verticalScale(4),
    alignItems: 'center',
  },
  answerTitle: {
    fontSize: scale(20),
    color: '#FBF8CC',
  },
  wrapButtonContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: 52,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#0877B6',
  },
  buttonTitle: {
    color: '#FBF8CC',
    fontSize: 20,
  },
});

export default GeometryComponent;
