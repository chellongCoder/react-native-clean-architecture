import React from 'react';
import {Image, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {verticalScale} from 'react-native-size-matters';

const DraggableZoomableRotatableImage = ({source, style}) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const savedRotateZ = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
    })
    .onEnd(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate(event => {
      rotateZ.value = savedRotateZ.value + event.rotation;
    })
    .onEnd(() => {
      savedRotateZ.value = rotateZ.value;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
        {rotateZ: `${rotateZ.value}rad`},
      ],
    };
  });

  const composedGesture = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    rotationGesture,
  );

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[animatedStyle, {paddingVertical: verticalScale(50)}]}>
        <Image
          resizeMode="contain"
          source={source}
          style={[style, {height: verticalScale(100)}]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableZoomableRotatableImage;
