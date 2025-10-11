import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
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
  const listAnswer = question?.answers as string[];

  const i18n = useI18n();

  const onSelectAnswer = (item: string) => {
    _setSelectedAnswer && _setSelectedAnswer(item);
  };

  const onSubmit = useCallback(() => {
    _onSubmit?.();
  }, [_onSubmit]);

  return (
    <View style={styles.container}>
      <Text style={[globalStyle.txtLabel, styles.pb16, styles.textColor]}>
        {i18n.t('lesson.screens.Modules.chooseTheCorrectAnswer')}
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
            style={{width: scale(150), height: verticalScale(120)}}
            resizeMode="contain"
          />
        </View>

        {/* List answer */}
        <View style={[{flex: 0.7}, styles.listAnswerContainer]}>
          {listAnswer?.map((item: string) => {
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
            {i18n.t('lesson.screens.Modules.submit')}
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
    borderRadius: scale(32),
    backgroundColor: '#FBF8CC',
    flexDirection: 'row',
    padding: 16,
  },
  questionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  questionTitle: {
    fontSize: moderateScale(35),
    color: '#FE311F',
  },
  listAnswerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 4,
  },
  answerContainer: {
    backgroundColor: COLORS.YELLOW_F2B559,
    borderRadius: scale(10),
    paddingVertical: verticalScale(4),
    alignItems: 'center',
  },
  answerTitle: {
    fontSize: moderateScale(20),
    color: '#FBF8CC',
  },
  wrapButtonContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    marginTop: verticalScale(16),
    backgroundColor: '#0877B6',
  },
  buttonTitle: {
    color: '#FBF8CC',
    fontSize: moderateScale(20),
  },
});

export default GeometryComponent;
