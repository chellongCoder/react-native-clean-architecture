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
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';
import FastImage from 'react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SelectionCircleAnswersProps {
  question?: React.ReactNode;
  answer: string[];
  isShowCorrectContainer: boolean;
  isAnswerCorrect: boolean;
  onSelectAnswer: (selected: string[]) => void;
  learningTimer: number;
  isSelectOne?: boolean;
  fontFamily?: FontFamily;
  questionStyle?: StyleProp<TextStyle>;
  answerStyle?: StyleProp<TextStyle>;
  centerImage?: string;
  backgroundColor?: string;
  containerStyle?: StyleProp<any>;
}

export interface SelectionCircleAnswersRef {
  getSelectedAnswers: () => string[];
  resetAnswerSelected: () => void;
  handleSelectAnswer: (e: string) => void;
}

const SelectionCircleAnswers: ForwardRefRenderFunction<
  SelectionCircleAnswersRef,
  SelectionCircleAnswersProps
> = (props, ref) => {
  const {
    answer,
    isShowCorrectContainer,
    isAnswerCorrect,
    onSelectAnswer,
    learningTimer,
    isSelectOne,
    fontFamily,
    answerStyle,
    centerImage,
    containerStyle,
  } = props;

  const [answerSelected, setAnswerSelected] = useState<string[]>([]);

  // Animation for infinite rotation
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 8000, // 8 seconds for one full rotation
        easing: Easing.linear,
      }),
      -1, // infinite repeat
      false, // don't reverse
    );
  }, [rotation]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  const handleSelectAnswer = (e: string) => {
    if (isSelectOne) {
      setAnswerSelected(_ => {
        const newSelected: string[] = [e];
        onSelectAnswer(newSelected);
        return newSelected;
      });
      return;
    }

    setAnswerSelected(prev => {
      const newSelected = prev.includes(e)
        ? prev.filter(item => item !== e)
        : [...prev, e];
      onSelectAnswer(newSelected);
      return newSelected;
    });
  };

  useImperativeHandle(ref, () => ({
    getSelectedAnswers: () => answerSelected,
    resetAnswerSelected: () => setAnswerSelected([]),
    handleSelectAnswer,
  }));

  // Calculate positions for rectangular layout
  const containerSize = WIDTH_SCREEN - scale(100);
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  const centerCircleRadius = scale(80);
  const answerCircleRadius = scale(45);
  const horizontalOffset = scale(100);
  const verticalOffset = scale(80);

  const getRectanglePosition = (index: number, _total: number) => {
    // Define 4 positions: top-left, top-right, bottom-left, bottom-right
    const positions = [
      // Top-left
      {
        x: centerX - horizontalOffset - answerCircleRadius,
        y: centerY - verticalOffset - answerCircleRadius,
      },
      // Top-right
      {
        x: centerX + horizontalOffset - answerCircleRadius,
        y: centerY - verticalOffset - answerCircleRadius,
      },
      // Bottom-left
      {
        x: centerX - horizontalOffset - answerCircleRadius,
        y: centerY + verticalOffset - answerCircleRadius,
      },
      // Bottom-right
      {
        x: centerX + horizontalOffset - answerCircleRadius,
        y: centerY + verticalOffset - answerCircleRadius,
      },
    ];

    // Return position based on index, cycling through positions if more than 4 items
    return positions[index % 4];
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: 'transparent'},
        containerStyle,
      ]}>
      <View
        style={[
          styles.circleContainer,
          {width: containerSize, height: containerSize},
        ]}>
        {/* Dashed connecting lines */}

        <Animated.View
          style={[
            {
              width: '80%',
              height: '80%',
              borderRadius: 1000,
              borderWidth: 3,
              borderStyle: 'dashed',
              borderColor: '#F2B559',
            },
            animatedCircleStyle,
          ]}
        />

        {/* Central image */}
        <View
          style={[
            styles.centerImageContainer,
            {
              left: centerX - centerCircleRadius,
              top: centerY - centerCircleRadius,
              width: centerCircleRadius * 2,
              height: centerCircleRadius * 2,
            },
          ]}>
          {centerImage && (
            <FastImage
              source={{uri: centerImage}}
              style={styles.centerImage}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Answer buttons in rectangular arrangement */}
        {answer.map((item, index) => {
          const position = getRectanglePosition(index, answer.length);
          const bg = answerSelected.includes(item.trim())
            ? isShowCorrectContainer && !isAnswerCorrect
              ? '#F28759'
              : '#66C270'
            : '#F2B559';

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectAnswer(item)}
              style={[
                styles.answerButton,
                {
                  position: 'absolute',
                  left: position.x,
                  top: position.y,
                  width: answerCircleRadius * 2,
                  height: answerCircleRadius * 2,
                  borderRadius: answerCircleRadius,
                  backgroundColor: bg,
                },
              ]}>
              <Text
                allowFontScaling
                adjustsFontSizeToFit
                numberOfLines={2}
                style={[
                  styles.answerText,
                  fontFamily && {fontFamily},
                  answerStyle,
                ]}>
                {item.trim().toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {learningTimer !== 0 && <View style={styles.overlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
    paddingVertical: verticalScale(20),
  },
  questionContainer: {
    marginBottom: verticalScale(20),
    paddingHorizontal: scale(16),
  },
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: scale(80),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  centerImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(80),
  },
  answerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  answerText: {
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: COLORS.WHITE_FBF8CC,
    fontSize: scale(12),
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: scale(4),
  },
  overlay: {
    position: 'absolute',
    zIndex: 999,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.7,
  },
});

export default forwardRef(SelectionCircleAnswers);
