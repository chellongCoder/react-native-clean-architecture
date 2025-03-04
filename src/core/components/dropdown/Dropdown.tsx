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
import * as Haptics from 'expo-haptics';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {ScrollView} from 'react-native-gesture-handler';
import {isAndroid} from 'src/core/presentation/utils';

type Props = {
  data: any[];
  title: string;
  onSelectItem: (item: any) => void;
  getTitleItem?: (itemId: string) => any;
  width?: number;
  prefix?: string;
  nameIndex?: string;
};

const ScrollViewDropdown = Animated.createAnimatedComponent(ScrollView);

const Dropdown = ({
  data,
  title,
  width,
  prefix,
  nameIndex,
  getTitleItem,
  onSelectItem,
}: Props) => {
  const globalStyle = useGlobalStyle();
  const [isShowLimitOption, setIsShowLimitOption] = useState(false);
  const ITEM_HEIGHT = scale(40);
  const maxHeight = useSharedValue(0);
  const itemTitleRef = useRef('');

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: maxHeight.value + 10,
      overflow: 'hidden',
    };
  });

  const toggleDropdown = () => {
    const totalHeight = data.length * ITEM_HEIGHT;
    setIsShowLimitOption(!isShowLimitOption);
    maxHeight.value = withTiming(isShowLimitOption ? 0 : totalHeight, {
      duration: 300,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
          <ScrollViewDropdown
            nestedScrollEnabled
            style={[
              styles.dropdown,
              !isAndroid && animatedStyles,
              width ? {width} : {},
              {maxHeight: verticalScale(100)},
            ]}>
            {data
              .filter(e => e !== title)
              .map((p, i) => {
                // Lấy tiêu đề của mục bằng cách sử dụng hàm getTitleItem, nếu nó tồn tại
                let itemTitle = getTitleItem?.(p.subjectId)?.name;

                // Kiểm tra xem tiêu đề của mục hiện tại có giống với tiêu đề trước đó không
                if (
                  itemTitleRef.current &&
                  itemTitleRef.current === itemTitle
                ) {
                  // Nếu tiêu đề giống nhau, đặt tiêu đề của mục thành undefined
                  itemTitle = undefined;
                } else {
                  // Nếu tiêu đề khác nhau, cập nhật tham chiếu đến tiêu đề của mục hiện tại
                  itemTitleRef.current = itemTitle;
                }

                return (
                  <>
                    <TouchableOpacity
                      key={i}
                      activeOpacity={1}
                      onPress={() => {
                        onSelectItem(p);
                        setIsShowLimitOption(false);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}>
                      {itemTitle && (
                        <Text style={styles.titleSubject}>{itemTitle}</Text>
                      )}
                      <Text style={[globalStyle.txtNote, styles.option]}>
                        {typeof p === 'object' ? p[nameIndex!] : p}
                        {prefix}
                      </Text>
                      <View
                        style={[
                          styles.divide,
                          i === data.length - 1 && {
                            marginBottom: verticalScale(20),
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </>
                );
              })}
          </ScrollViewDropdown>
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
    color: COLORS.GREEN_1C6349,
  },
  titleSubject: {
    color: COLORS.BACKGROUND,
    fontFamily: FontFamily.SVNNeuzeitBold,
  },
  divide: {
    height: scale(0.5),
    backgroundColor: COLORS.GREEN_1C6349,
    marginVertical: verticalScale(5),
  },
});
