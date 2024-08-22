import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {COLORS} from 'src/core/presentation/constants/colors';
import IconDiamond from 'assets/svg/IconDiamond';
import IconStar from 'assets/svg/iconStar';
import CustomSwitchNew from 'src/home/presentation/components/CustomSwitchNew';

type Props = {
  lessonName?: string;
  module?: string;
  price?: string;
  part?: string;
  score?: number;
};

const HeaderLesson = ({lessonName, module, price, score, part}: Props) => {
  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();
  return (
    <View>
      <View style={{height: insets.top}} />
      <View style={[styles.rowBetween, {alignItems: 'flex-start'}]}>
        <View
          style={[
            styles.rowBetween,
            {alignItems: 'center', maxWidth: scale(250)},
          ]}>
          <Text style={[styles.fonts_SVN_Cherish, styles.textTitle]}>
            {lessonName}
          </Text>
          <View
            style={{
              height: verticalScale(20),
              width: scale(3),
              backgroundColor: COLORS.GREEN_1C6349,
              borderRadius: scale(10),
              marginHorizontal: scale(8),
            }}
          />
          <View>
            <Text style={[globalStyle.txtButton, styles.textModule]}>
              {module}
            </Text>
            <Text style={[globalStyle.txtNote, styles.textPart]}>{part}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeaderLesson;

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textTitle: {
    fontSize: 30,
    color: COLORS.GREEN_1C6349,
  },
  alightEnd: {
    alignItems: 'flex-end',
  },
  textModule: {
    fontSize: 10,
    color: COLORS.BLUE_258F78,
  },
  textPart: {
    fontSize: 10,
    color: COLORS.BLUE_258F78,
    fontWeight: '300',
  },
  boxPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 100,
    width: 90,
    backgroundColor: '#FFE699',
  },
  textPrice: {
    fontSize: 18,
    color: '#1C6349',
  },
});
