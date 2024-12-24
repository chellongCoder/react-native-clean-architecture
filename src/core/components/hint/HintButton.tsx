import React, {useEffect} from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import {assets} from 'src/core/presentation/utils';

const defaultStyles = {
  bgGradientColors: [
    '#8DE795',
    '#68D24C',
    '#4CB572',
    '#48B472',
    '#21A770',
    '#099F6F',
    '#009C6F',
  ],
  headGradientColors: ['#ffffff', '#E1E4E8'],
};

const activeStyles = {
  bgGradientColors: [
    '#8DE795',
    '#68D24C',
    '#4CB572',
    '#48B472',
    '#18A470',
    '#099F6F',
    '#009C6F',
  ],
  headGradientColors: ['#444D56', '#0E1723'],
};

type TPros = {
  value?: boolean;
  onValueChange?: (a: boolean) => void;
  point?: number;
};

const HintButton = ({value, onValueChange, point}: TPros) => {
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
    onValueChange?.(newValue);
  };

  const currentStyles = value ? activeStyles : defaultStyles;

  return (
    <Pressable onPress={toggleSwitch} style={styles.pressable} disabled>
      <ImageBackground
        resizeMethod="scale"
        resizeMode="cover"
        source={assets.bg_hint}
        style={styles.backgroundImage}>
        <LinearGradient
          colors={currentStyles.bgGradientColors}
          style={[styles.backgroundGradient, styles.border]}
          start={{x: 0.5, y: 1}}
          end={{x: 0.5, y: 0}}>
          <LinearGradient
            colors={currentStyles.bgGradientColors}
            style={styles.backgroundGradient}
            start={{x: 0.5, y: 0}}
            locations={[0, 0.3, 0.6, 0.66, 0.8, 0.84, 1]}
            end={{x: 0.5, y: 1}}>
            <ImageBackground
              resizeMethod="scale"
              resizeMode="contain"
              source={assets.bg_hint}
              style={styles.innerContainer}>
              <Animated.View
                style={[styles.wrapContentContainer, animatedStyle]}>
                <View style={styles.fillCenter}>
                  <View style={styles.wrapContent}>
                    <Text style={styles.title}>{'hint'}</Text>
                  </View>
                </View>
                <Image
                  source={assets.untitled_artwork}
                  resizeMode="contain"
                  style={styles.icon}
                />
              </Animated.View>
            </ImageBackground>
          </LinearGradient>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: scale(50),
    height: verticalScale(50),
  },
  border: {},
  icon: {
    height: scale(15),
    width: scale(25),
  },
  fillCenter: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  wrapContent: {},
  decorate: {
    alignSelf: 'stretch',
    borderRadius: 999,
  },
  backgroundGradient: {
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(20),
    borderWidth: 1,
    borderColor: COLORS.GREEN_009C6F,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.WHITE_FBF8CC,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
  },
  backgroundImage: {
    flex: 1,
  },
});

export default HintButton;
