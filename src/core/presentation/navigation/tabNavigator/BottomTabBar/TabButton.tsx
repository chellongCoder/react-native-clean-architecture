import React, {useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import styles from '../styles';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {STACK_NAVIGATOR} from '../../ConstantNavigator';
import {assets} from 'src/core/presentation/utils';

const {BOTTOM_TAB} = STACK_NAVIGATOR;

const widthScreen = Dimensions.get('screen').width;

export const heightItem = 54;

const BottomTabColor = {
  [BOTTOM_TAB.HOME_TAB]: COLORS.GREEN_66C270,
  [BOTTOM_TAB.TARGET_TAB]: COLORS.YELLOW_F2B559,
  [BOTTOM_TAB.PARENT_TAB]: COLORS.RED_F28759,
  [BOTTOM_TAB.CHILD_TAB]: COLORS.BLUE_A3F0DF,
  [BOTTOM_TAB.ACHIEVEMENT_TAB]: COLORS.WHITE_FFE699,
  [BOTTOM_TAB.RANK_TAB]: COLORS.YELLOW_F2B559,
};

const TitleTabBar = (name: string, isFocused: boolean) => {
  const titles = {
    [BOTTOM_TAB.HOME_TAB]: 'Home',
    [BOTTOM_TAB.TARGET_TAB]: 'Target',
    [BOTTOM_TAB.PARENT_TAB]: 'Parent',
    [BOTTOM_TAB.CHILD_TAB]: 'Child',
    [BOTTOM_TAB.ACHIEVEMENT_TAB]: 'Achievement',
    [BOTTOM_TAB.RANK_TAB]: 'Rank',
  };
  const title = titles[name];
  if (!title) {
    return null;
  }

  return (
    <Text style={isFocused ? styles.tabTextActive : styles.tabText}>
      {title}
    </Text>
  );
};

const BottomTabIcon = (name: string) => {
  const icons = {
    [BOTTOM_TAB.HOME_TAB]: assets.home_icon_new,
    [BOTTOM_TAB.TARGET_TAB]: assets.home_icon_new,
    [BOTTOM_TAB.PARENT_TAB]: assets.parent_icon_new,
    [BOTTOM_TAB.CHILD_TAB]: assets.child_icon_new,
    [BOTTOM_TAB.ACHIEVEMENT_TAB]: assets.achievement_icon_new,
    [BOTTOM_TAB.RANK_TAB]: assets.rank_icon_new,
  };
  const icon = icons[name];
  if (!icon) {
    return null;
  }

  return icon;
};

const TabButton = ({
  options,
  onPress,
  route,
  isFocused,
  numberOfTab,
  viewIndex,
}) => {
  const index = numberOfTab.findIndex((tab: string) => tab.name === route.name);
  const isFirst = index === 0;
  const isLast = index === numberOfTab.length - 1;
  const lengthTab = numberOfTab.length;

  const translate = useSharedValue(0);
  const scales = useSharedValue(scale(24));
  const translateX = useSharedValue(0);

  const handleAnimated = useCallback(() => {
    translate.value = withTiming(isFocused ? 1 : 0, {duration: 400});
    scales.value = withTiming(isFocused ? scale(48) : scale(24), {
      duration: 250,
    });
    const bulge = viewIndex > 0 && viewIndex < 4 ? (viewIndex - 2) * 0.08 : 0;
    translateX.value = withTiming(
      (widthScreen * (viewIndex - index + bulge)) / lengthTab,
      {duration: 400},
    );
  }, [index, isFocused, lengthTab, scales, translate, translateX, viewIndex]);

  useEffect(() => {
    handleAnimated();
  }, [isFocused, handleAnimated]);

  const translateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(translate.value, [0, 1], [0, -40], 'clamp'),
        },
      ],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      borderWidth: interpolate(translate.value, [0, 1], [2, 8], 'clamp'),
      backgroundColor: interpolateColor(
        translate.value,
        [0, 1],
        ['#258f78', '#fffbe3'],
      ),
    };
  });

  // const borderStyle = useAnimatedStyle(() => {
  //   return {
  //     borderWidth: interpolate(translate.value, [0, 1], [0, 6], 'clamp'),
  //     borderColor: '#258f78',
  //     backgroundColor: '#258f78',
  //     borderRadius: 999,
  //   };
  // });

  const translateXStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const scaleStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scales.value, [0.5, 1], [0.5, 1], 'clamp'),
      width: scales.value,
      height: scales.value,
    };
  });

  const scaleTextStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(translate.value, [0, 1], [1, 1.2], 'clamp'),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          ...styles.bottomMenuContainer,
          height: scale(heightItem),
        },
        translateXStyles,
      ]}>
      <TouchableOpacity
        hitSlop={styles.hitSlop}
        accessibilityRole="button"
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        style={[
          {
            ...styles.bottomMenuContainer,
          },
        ]}
        activeOpacity={1}>
        <Animated.View style={[styles.wrapBottomTabContainer, translateStyles]}>
          <Animated.View
            style={[
              styles.bottomTabIcon,
              {borderColor: BottomTabColor[route.name]},
              iconStyle,
              scaleStyles,
            ]}>
            <Image
              source={BottomTabIcon(route.name)}
              resizeMode="center"
              style={styles.icon}
            />
          </Animated.View>
        </Animated.View>
        <Animated.View style={[styles.wrapTitleContainer, scaleTextStyles]}>
          {TitleTabBar(route.name, isFocused)}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TabButton;
