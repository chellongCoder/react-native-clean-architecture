import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useRef} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import IconArrowUp from 'assets/svg/IconArrowUp';
import IconArrowDown from 'assets/svg/IconArrowDown';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {COLORS} from 'src/core/presentation/constants/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  data: any[];
  title: string;
  onSelectItem: (item: any) => void;
  width?: number;
  prefix?: string;
  nameIndex?: string;
};

const Dropdown = ({
  data,
  title,
  width,
  prefix,
  nameIndex,
  onSelectItem,
}: Props) => {
  const globalStyle = useGlobalStyle();
  const [isShowLimitOption, setIsShowLimitOption] = useState(false);
  const ITEM_HEIGHT = scale(40);
  const maxHeight = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: maxHeight.value,
      overflow: 'hidden',
    };
  });

  const toggleDropdown = () => {
    const totalHeight = data.length * ITEM_HEIGHT;
    setIsShowLimitOption(!isShowLimitOption);
    maxHeight.value = withTiming(isShowLimitOption ? 0 : totalHeight, {
      duration: 300,
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={toggleDropdown}
        activeOpacity={1}
        style={[
          styles.card,
          {
            zIndex: 999,
            backgroundColor: !isShowLimitOption
              ? styles.card.backgroundColor
              : COLORS.GREEN_1C6349,
            width: width ?? scale(70),
          },
        ]}>
        <Text
          style={[
            globalStyle.txtButton,
            {
              flex: 1,
              color: isShowLimitOption
                ? styles.card.backgroundColor
                : COLORS.GREEN_1C6349,
            },
          ]}>
          {title}
          {prefix}
        </Text>
        {isShowLimitOption ? <IconArrowUp /> : <IconArrowDown />}
      </TouchableOpacity>
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: {width: 3, height: 5},
          shadowOpacity: 0.4,
        }}>
        {isShowLimitOption && (
          <Animated.View
            style={[styles.dropdown, animatedStyles, width ? {width} : {}]}>
            {data
              .filter(e => e !== title)
              .map((p, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={1}
                    onPress={() => {
                      onSelectItem(p);
                      setIsShowLimitOption(false);
                    }}
                    style={[
                      i !== data.length - 1
                        ? {
                            borderBottomWidth: 0.5,
                            borderColor: COLORS.GREEN_1C6A59,
                          }
                        : {},
                    ]}>
                    <Text style={[globalStyle.txtNote, styles.option]}>
                      {typeof p === 'object' ? p[nameIndex!] : p}
                      {prefix}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </Animated.View>
        )}
      </View>
    </>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: scale(12),
    paddingBottom: scale(10),
    paddingHorizontal: scale(10),
    width: scale(70),
    borderBottomRightRadius: scale(20),
    borderBottomLeftRadius: scale(20),
    paddingTop: verticalScale(10),
    position: 'absolute', // Set position to absolute
  },
  card: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(8),
    borderRadius: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFE699',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(-10),
    marginRight: scale(8),
  },
  option: {
    paddingVertical: verticalScale(6),
    color: COLORS.GREEN_1C6349,
  },
});
