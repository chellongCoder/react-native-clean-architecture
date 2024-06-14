import IconSoundFill from 'assets/svg/IconSoundFill';
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  value?: number;
  maxValue?: number;
  onChangValue?: (v: number) => void;
};

const Volume = ({maxValue = 100, value = 0, onChangValue}: Props) => {
  const widthSlider = useSharedValue(200);
  const translationX = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translationX.value;
    })
    .onUpdate(e => {
      translationX.value = Math.max(
        0,
        Math.min(widthSlider.value, e.translationX + prevTranslationX.value),
      );
    })
    .onEnd(() => {
      onChangValue?.((translationX.value / widthSlider.value) * maxValue);
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translationX.value}],
    };
  });

  useEffect(() => {
    translationX.value = withTiming((value * widthSlider.value) / maxValue, {
      duration: 100,
    });
  }, [maxValue, translationX, value, widthSlider]);

  return (
    <View style={styles.container}>
      <IconSoundFill />
      <View
        style={styles.sliderContainer}
        onLayout={e => (widthSlider.value = e.nativeEvent.layout.width)}>
        <View style={styles.track} />
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.thumb, animatedStyle]}>
            <View style={[styles.thumbView]} />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 12,
  },
  track: {
    width: '100%',
    height: 3,
    backgroundColor: '#258F78',
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 40,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: -20,
  },
  thumbView: {
    backgroundColor: '#66C270',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  gesture: {
    height: 30,
    width: 30,
    position: 'absolute',
  },
});

export default Volume;
