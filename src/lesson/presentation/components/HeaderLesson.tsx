import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {COLORS} from 'src/core/presentation/constants/colors';

type Props = {
  lessonName?: string;
  module?: string;
  price?: string;
  part?: string;
  score?: number;
  color?: string;
};

const HeaderLesson = ({
  lessonName,
  module,
  price,
  score,
  part,
  color,
}: Props) => {
  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();
  const textColor = useMemo(() => color, [color]);
  return (
    <View>
      <View style={{height: insets.top}} />
      <View style={[styles.rowBetween, {alignItems: 'flex-start'}]}>
        <View
          style={[
            styles.rowBetween,
            {alignItems: 'center', maxWidth: scale(250)},
          ]}>
          <Text
            style={[
              styles.fonts_SVN_Cherish,
              styles.textTitle,
              {color: textColor},
            ]}>
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
            <Text
              style={[
                globalStyle.txtButton,
                styles.textModule,
                {color: textColor},
              ]}>
              {module}
            </Text>
            <Text
              style={[
                globalStyle.txtNote,
                styles.textPart,
                {color: textColor},
              ]}>
              {part}
            </Text>
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
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textTitle: {
    fontSize: moderateScale(30),
    color: COLORS.GREEN_1C6349,
  },
  alightEnd: {
    alignItems: 'flex-end',
  },
  textModule: {
    fontSize: moderateScale(10),
    color: COLORS.BLUE_258F78,
  },
  textPart: {
    fontSize: moderateScale(10),
    color: COLORS.BLUE_258F78,
    fontWeight: '300',
  },
});
