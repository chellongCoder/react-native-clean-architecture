import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import IconArrowUp from 'assets/svg/IconArrowUp';
import IconArrowDown from 'assets/svg/IconArrowDown';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {COLORS} from 'src/core/presentation/constants/colors';

type Props = {
  data: any[];
  title: string;
  onSelectItem: (item: string) => void;
  width?: number;
  prefix?: string;
};
const Dropdown = ({data, title, width, prefix, onSelectItem}: Props) => {
  const globalStyle = useGlobalStyle();
  const [isShowLimitOption, setIsShowLimitOption] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setIsShowLimitOption(v => !v)}
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
      {isShowLimitOption && (
        <View style={[styles.dropdown, width ? {width} : {}]}>
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
                    {p}
                    {prefix}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      )}
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
    shadowRadius: 12,
    paddingBottom: 10,
    paddingTop: 20,
    paddingHorizontal: 10,
    top: 40,
    position: 'absolute',
    zIndex: 1,
    width: scale(70),
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
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
    marginBottom: verticalScale(12),
    marginRight: scale(8),
  },
  option: {
    paddingVertical: verticalScale(6),
    color: COLORS.GREEN_1C6349,
  },
});
