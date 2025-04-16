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
import TextHighlight from '../TextHighlight';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';

type DescriptionModuleProps = {};

// type Module = 'text' | 'paragraph' | 'image' | 'images'
const DescriptionModule = ({}: DescriptionModuleProps) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const hook = useModuleDetail();
  const opacity = useSharedValue(0);
  const scaleS = useSharedValue(1);

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

  switch (hook.descriptionType) {
    case 'text-blank':
      return (
        <View style={styles.mainContent}>
          <Text
            style={[
              styles.descriptionText,
              hook.textDescriptionProps && {
                fontFamily: hook.textDescriptionProps?.fontName,
                color: hook.textDescriptionProps?.color,
                fontSize: hook.textDescriptionProps?.fontSize,
              },
            ].flat()}>
            {hook.firstMiniTestTask?.question?.[hook.moduleIndex]?.content}
          </Text>
        </View>
      );
    case 'text-highlight':
      return (
        <View style={styles.mainContent}>
          <TextHighlight
            content={
              hook.firstMiniTestTask?.question?.[hook.moduleIndex]?.content ??
              ''
            }
            description={
              hook.firstMiniTestTask?.question?.[hook.moduleIndex]
                ?.description ?? ''
            }
            style={[
              styles.descriptionText,
              {
                fontFamily: hook.textDescriptionProps?.fontName,
                color: hook.textDescriptionProps?.color,
                fontSize: hook.textDescriptionProps?.fontSize,
              },
            ].flat()}
            styleHighlight={styles.styleHighlight}
          />
        </View>
      );
    case 'image':
      return (
        <View
          style={{
            alignItems: 'center',
          }}>
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
    fontFamily: FontFamily.SVNCherishMoment,
    fontSize: scale(32),
    lineHeight: verticalScale(44.8),
  },
  styleHighlight: {
    textDecorationLine: 'underline',
  },
});

export default DescriptionModule;
