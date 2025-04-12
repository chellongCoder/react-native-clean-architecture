import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TextStyle} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {useModuleDetail} from './hook';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {EnvToken} from 'src/core/domain/entities/Env';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env from 'src/core/domain/entities/Env';

type DescriptionModuleProps = {
  text: string | string[];
  textColor?: string;
  textSize?: number;
  lineHeight?: number;
  fontWeight?: TextStyle['fontWeight'];
};

// type Module = 'text' | 'paragraph' | 'image' | 'images'
const DescriptionModule = ({}: DescriptionModuleProps) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const hook = useModuleDetail();
  const opacity = useSharedValue(0);
  const scaleS = useSharedValue(1);

  const descriptionType = useMemo(() => {
    if (hook.firstMiniTestTask?.question?.[hook.moduleIndex]?.description) {
      return 'text';
    } else if (
      typeof hook.firstMiniTestTask?.question?.[hook.moduleIndex]?.image ===
      'string'
    ) {
      return 'image';
    } else if (
      Array.isArray(hook.firstMiniTestTask?.question?.[hook.moduleIndex]?.image)
    ) {
      return 'images';
    } else if (
      Array.isArray(
        hook.firstMiniTestTask?.question?.[hook.moduleIndex]?.paragraph,
      )
    ) {
      return 'paragraph';
    }
  }, [hook.firstMiniTestTask?.question, hook.moduleIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scaleS.value}],
    };
  });

  useEffect(() => {
    opacity.value = withTiming(0, {duration: 500}, () => {
      opacity.value = withTiming(1, {duration: 500});
    });
    scaleS.value = withTiming(0, {duration: 500}, () => {
      scaleS.value = withTiming(1, {
        duration: 500,
        easing: Easing.elastic(2),
        reduceMotion: ReduceMotion.System,
      });
    });
  }, [hook.moduleIndex, opacity, scaleS]);

  switch (descriptionType) {
    case 'text':
      return (
        <View style={styles.mainContent}>
          <Text style={styles.descriptionText}>
            {hook.firstMiniTestTask?.question?.[hook.moduleIndex]?.description}
          </Text>
        </View>
      );
    case 'image':
      return (
        <View style={{alignItems: 'center'}}>
          <Animated.Image
            resizeMode={'contain'}
            style={[
              {
                width: scale(200),
                height: verticalScale(140),
              },
              animatedStyle,
            ]}
            source={{
              uri:
                env.IMAGE_QUESTION_BASE_API_URL +
                hook.firstMiniTestTask?.question?.[hook.moduleIndex].image,
            }}
          />
        </View>
      );
    default:
      return <></>;
  }

  // return (
  //   <View style={styles.mainContent}>
  //     <Text
  //       style={[
  //         styles.descriptionText,
  //         {
  //           color: textColor,
  //           fontSize: scale(textSize),
  //           lineHeight: scale(lineHeight),
  //           fontWeight: fontWeight,
  //         },
  //       ]}>
  //       {content}
  //     </Text>
  //   </View>
  // );
};

const styles = StyleSheet.create({
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  descriptionText: {
    textAlign: 'center',
  },
});

export default DescriptionModule;
