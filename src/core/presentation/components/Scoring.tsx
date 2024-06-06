import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {COLORS} from '../constants/colors';
import useGlobalStyle from '../hooks/useGlobalStyle';
import {observer} from 'mobx-react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const screen = Dimensions.get('screen');

const Scoring = observer(({onClose}) => {
  const styleHook = useGlobalStyle();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  React.useEffect(() => {
    scale.value = withTiming(1.5, {duration: 1000, easing: Easing.bounce});
  }, [scale]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onClose}
      style={styles.container}>
      <Animated.Text
        style={[animatedStyle, styleHook.txtWord, {color: COLORS.WHITE}]}>
        +10 point
      </Animated.Text>
    </TouchableOpacity>
  );
});

export default Scoring;

const styles = StyleSheet.create({
  container: {
    width: screen.width,
    height: screen.height,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: COLORS.CUSTOM(COLORS.BLACK, 0.5),
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
