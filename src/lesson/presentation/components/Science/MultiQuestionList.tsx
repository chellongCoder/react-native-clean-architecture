import React from 'react';
import {StyleSheet, Text, View, ViewStyle, StyleProp} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';

type Props = {
  title: string;
  questions: string[];
  style?: StyleProp<ViewStyle>;
  titleColor?: string;
  questionColor?: string;
  backgroundColor?: string;
  activeIndex?: number;
};

const MultiQuestionList: React.FC<Props> = ({
  title,
  questions,
  style,
  titleColor = '#A5FFEF',
  questionColor = '#5440D2',
  backgroundColor = '#E2CBF7',
  activeIndex,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <Text style={[styles.title, {color: titleColor}]}>{title}</Text>

      {/* Questions List */}
      <View style={styles.questionsContainer}>
        {questions.map((question, index) => (
          <View
            key={index}
            style={[
              styles.questionItem,
              {
                backgroundColor:
                  activeIndex === index ? backgroundColor : 'transparent',
              },
            ]}>
            <Text
              style={[
                styles.questionText,
                {color: activeIndex === index ? questionColor : COLORS.WHITE},
              ]}>
              {`${index + 1}. ${question}`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(20),
    paddingHorizontal: scale(20),
  },

  title: {
    fontSize: scale(60),
    fontFamily: FontFamily.SVNCherishMoment,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    fontWeight: 'bold',
    textShadowRadius: 4,
    letterSpacing: scale(2),
  },
  questionsContainer: {
    justifyContent: 'center',
  },
  questionItem: {
    borderRadius: scale(10),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
  },
  questionText: {
    fontSize: scale(22),
    fontFamily: FontFamily.SVNCherishMoment,
    textAlign: 'center',
  },
  // Decorative elements
  star: {
    position: 'absolute',
    width: scale(12),
    height: scale(12),
    backgroundColor: '#FFD700',
    transform: [{rotate: '45deg'}],
  },
  circle: {
    position: 'absolute',
    width: scale(8),
    height: scale(8),
    backgroundColor: '#FFB6C1',
    borderRadius: scale(4),
  },
  starTopLeft: {
    top: verticalScale(15),
    left: scale(15),
  },
  circleTopRight: {
    top: verticalScale(20),
    right: scale(20),
  },
  starBottomLeft: {
    bottom: verticalScale(25),
    left: scale(25),
  },
  circleBottomRight: {
    bottom: verticalScale(15),
    right: scale(15),
  },
});

export default MultiQuestionList;
