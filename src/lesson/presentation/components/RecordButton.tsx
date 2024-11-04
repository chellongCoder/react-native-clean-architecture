import React, {useCallback, useEffect, useRef} from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {assets} from 'src/core/presentation/utils';

type Props = {
  startRecord?: () => void;
  stopRecord?: () => void;
  loadingRecord?: boolean;
  errorSpeech?: {code?: string; message?: string};
};
const RecordButton = ({
  startRecord,
  stopRecord,
  loadingRecord,
  errorSpeech,
}: Props) => {
  const scaleValue = useSharedValue(0.05); // Start from 0.05 times the size to scale from 10 to 200
  const opacityValue = useSharedValue(1); // Start with full opacity
  const clickRef = useRef(false);

  const scaleLP = useSharedValue(1);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleValue.value}],
      opacity: opacityValue.value,
      width: 200, // Fixed width to scale to
      height: 200, // Fixed height to scale to
      borderRadius: 100, // Maintain circular shape
      backgroundColor: COLORS.PRIMARY,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    };
  });
  const animatedStyleLongPress = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleLP.value}],
      alignItems: 'center',
      justifyContent: 'center',
    };
  });
  const startAnimationRecord = useCallback(() => {
    scaleLP.value = withSpring(1.2);

    scaleValue.value = withRepeat(
      withTiming(1, {duration: 1000, easing: Easing.out(Easing.ease)}),
      -1, // Repeat indefinitely
      false, // Enable reverse mode
    );
    opacityValue.value = withRepeat(
      withTiming(0, {duration: 1000, easing: Easing.linear}),
      -1, // Repeat indefinitely
      false, // Enable reverse mode
    );
  }, [opacityValue, scaleLP, scaleValue]);

  const stopAnimationRecord = useCallback(() => {
    // Stop the animations by setting the shared values to their initial states
    scaleLP.value = withSpring(1);

    scaleValue.value = 0.05; // Reset to initial scale
    opacityValue.value = 1; // Reset to full opacity
  }, [scaleLP, scaleValue, opacityValue]);

  useEffect(() => {
    if (!loadingRecord) {
      stopAnimationRecord();
      clickRef.current = false;
    } else {
      startAnimationRecord();
      clickRef.current = true;
    }
  }, [loadingRecord, startAnimationRecord, stopAnimationRecord]);

  return (
    <Animated.View style={animatedStyleLongPress}>
      <Animated.View style={animatedCircleStyle} />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (clickRef.current) {
            // stopAnimationRecord();
            stopRecord?.();
            clickRef.current = !clickRef.current;
          } else {
            // startAnimationRecord();
            startRecord?.();
            clickRef.current = !clickRef.current;
          }
          console.log('press');
        }}>
        <Image
          source={errorSpeech ? assets.icon_voice_disable : assets.icon_voice}
          style={styles.iconImageContainer}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconImageContainer: {height: scale(71), width: scale(71)},
});

export default RecordButton;
