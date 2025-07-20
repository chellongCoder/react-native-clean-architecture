import React from 'react';
import {StyleSheet, Text, View, ViewStyle, StyleProp} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';

type Props = {
  title: string;
  questions: string[];
  style?: StyleProp<ViewStyle>;
  titleColor?: string;
  questionColor?: string;
  backgroundColor?: string;
};

const MultiQuestionList: React.FC<Props> = ({
  title,
  questions,
  style,
  titleColor = '#B4E7CE',
  questionColor = '#FFFFFF',
  backgroundColor = '#8B5FBF',
}) => {
  return (
    <View style={[styles.container, {backgroundColor}, style]}>
      {/* Title */}
      <Text style={[styles.title, {color: titleColor}]}>{title}</Text>

      {/* Questions List */}
      <View style={styles.questionsContainer}>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionItem}>
            <Text style={[styles.questionText, {color: questionColor}]}>
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
    paddingVertical: verticalScale(30),
    minHeight: verticalScale(200),
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: scale(32),
    fontFamily: FontFamily.SVNNeuzeitBold,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
    letterSpacing: scale(2),
  },
  questionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: scale(15),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  questionText: {
    fontSize: scale(16),
    fontFamily: FontFamily.SVNNeuzeitBold,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: scale(20),
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
