import React from 'react';
import {Image, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';

const DraggableZoomableRotatableImage = ({source, style}) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const savedRotateZ = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
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
      <Animated.View style={animatedStyle}>
        <Image resizeMode="contain" source={source} style={style} />
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableZoomableRotatableImage;
