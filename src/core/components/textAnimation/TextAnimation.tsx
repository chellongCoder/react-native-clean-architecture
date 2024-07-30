import {StyleProp, StyleSheet, TextStyle, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  speed?: number;
  style?: StyleProp<TextStyle>;
};

const TextAnimation = ({children, speed = 100, style}: Props) => {
  const textList = useMemo(() => {
    if (typeof children === 'string') {
      return children.trim().split(' ');
    }
    return [];
  }, [children]);

  return (
    <View style={[styles.textWrapper]}>
      {textList.map((text, i) => (
        <AnimatedWord
          key={`${text}-${i}`}
          delay={i * (speed - (speed * i) / (textList.length * 2))}
          style={style}>
          {text}
          {i < textList.length ? ' ' : ''}
        </AnimatedWord>
      ))}
    </View>
  );
};

export default TextAnimation;

const AnimatedWord = ({
  children,
  delay,
  style,
}: {
  children: React.ReactNode;
  delay: number;
  style?: StyleProp<TextStyle>;
}) => {
  const opacity = useSharedValue(0);

  const transform = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(opacity.value, [0, 1], [4, 0], 'clamp'),
      },
    ],
  }));

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, {duration: 600}));
  }, [children, delay, opacity]);

  return (
    <Animated.Text style={[style, transform, {opacity: opacity}]}>
      {children}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
