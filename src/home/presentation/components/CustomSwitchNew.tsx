import React, {useEffect} from 'react';
import {Pressable, View, StyleSheet, Text, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {
  CustomTextStyle,
  TYPOGRAPHY,
} from 'src/core/presentation/constants/typography';
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
  value: boolean;
  onValueChange: (a: boolean) => void;
};

const CustomSwitchNew = ({value, onValueChange}: TPros) => {
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
    onValueChange(newValue);
  };

  const currentStyles = value ? activeStyles : defaultStyles;

  return (
    <Pressable onPress={toggleSwitch} style={styles.pressable} disabled>
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
          <View style={styles.innerContainer}>
            <Animated.View style={[styles.wrapContentContainer, animatedStyle]}>
              <Image
                source={assets.untitled_artwork}
                resizeMode="contain"
                style={styles.icon}
              />
              <View style={styles.fillCenter}>
                <View style={styles.wrapContent}>
                  <View style={styles.decorate} />
                  <Text style={styles.title}>0</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: 70,
    height: 32,
    borderRadius: 16,
  },
  border: {
    padding: 2,
  },
  icon: {
    marginLeft: -38,
    height: 66,
    width: 66,
  },
  fillCenter: {
    flex: 1,
    alignItems: 'center',
  },
  wrapContent: {
    marginLeft: -12,
  },
  decorate: {
    backgroundColor: '#fbf8cc',
    height: 3,
    opacity: 0.5,
    alignSelf: 'stretch',
    borderRadius: 999,
  },
  backgroundGradient: {
    borderRadius: 16,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  headGradient: {
    width: 24,
    height: 24,
    borderRadius: 100,
  },
  wrapContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    ...CustomTextStyle.smallNormal,
    color: '#fbf8cc',
    textTransform: 'uppercase',
    fontSize: TYPOGRAPHY.SIZE.h6,
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
  },
});

export default CustomSwitchNew;