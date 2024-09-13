import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {assets} from 'src/core/presentation/utils';

type Props = {
  value?: number;
  maxValue?: number;
  onChangValue?: (v: number) => void;
};

const Volume = ({maxValue = 100, value = 0, onChangValue}: Props) => {
  const [widthSlider, setWidthSlider] = useState(0);
  const translationX = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translationX.value;
    })
    .onUpdate(e => {
      translationX.value = Math.max(
        0,
        Math.min(widthSlider, e.translationX + prevTranslationX.value),
      );
    })
    .onEnd(() => {
      onChangValue?.((translationX.value / widthSlider) * maxValue);
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translationX.value}],
    };
  });

  useEffect(() => {
    translationX.value = withTiming((value * widthSlider) / maxValue, {
      duration: 100,
    });
  }, [maxValue, translationX, value, widthSlider]);

  return (
    <View style={styles.container}>
      <Image
        source={assets.sound_icon}
        style={styles.sound}
        resizeMode="contain"
      />
      <View
        style={styles.sliderContainer}
        onLayout={e => setWidthSlider(e.nativeEvent.layout.width)}>
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
    marginLeft: 6,
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
  sound: {
    height: 32,
    width: 32,
  },
});

export default Volume;
