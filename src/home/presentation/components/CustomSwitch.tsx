import React, {useEffect} from 'react';
import {Pressable, View, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {scale} from 'react-native-size-matters';
import ICDiamond from 'src/core/components/icons/ICDiamond';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';

const defaultStyles = {
  bgGradientColors: [COLORS.WHITE_FFE699, COLORS.WHITE_FFE699],
  headGradientColors: ['#ffffff', '#E1E4E8'],
};

const activeStyles = {
  bgGradientColors: [COLORS.WHITE_FFE699, COLORS.WHITE_FFE699],
  headGradientColors: ['#444D56', '#0E1723'],
};

type TPros = {
  value: boolean;
  onValueChange: (a: boolean) => void;
};

const CustomSwitch = ({value, onValueChange}: TPros) => {
  const animatedValue = useSharedValue(value ? 0 : 1);

  useEffect(() => {
    animatedValue.value = withTiming(value ? 1 : 0, {duration: 300});
  }, [animatedValue, value]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(animatedValue.value, [0, 1], [4, 28]);
    return {
      transform: [{translateX}],
    };
  });

  const toggleSwitch = () => {
    const newValue = !value;
    onValueChange(newValue);
  };

  const currentStyles = value ? activeStyles : defaultStyles;

  return (
    <Pressable onPress={toggleSwitch} style={styles.pressable} disabled>
      <LinearGradient
        colors={currentStyles.bgGradientColors}
        style={styles.backgroundGradient}
        start={{x: 0, y: 0.5}}>
        <View style={styles.innerContainer}>
          <Animated.View style={[styles.wrapContentContainer, animatedStyle]}>
            <Text style={styles.title}>Free</Text>
            <ICDiamond width={24} height={24} />
          </Animated.View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: 70,
    height: 32,
    borderRadius: 16,
  },
  backgroundGradient: {
    borderRadius: 16,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  headGradient: {
    width: 24,
    height: 24,
    borderRadius: 100,
  },
  wrapContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  title: {
    ...CustomTextStyle.smallBold,
    color: COLORS.BLUE_1C6349,
    marginRight: scale(4),
    textTransform: 'uppercase',
  },
});

export default CustomSwitch;
