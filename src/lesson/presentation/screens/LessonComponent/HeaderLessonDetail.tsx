import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {assets, WIDTH_SCREEN} from 'src/core/presentation/utils';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import CustomSwitchNew from 'src/home/presentation/components/CustomSwitchNew';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';

type Props = {
  lessonName: string;
  module: string;
  part: string;
  score: number;
  txtCountDown?: string;
  onPressFlower?: () => void;
  accentColor?: string;
};

const HeaderLessonDetail = ({
  lessonName,
  module,
  part,
  score,
  txtCountDown,
  onPressFlower,
  accentColor,
}: Props) => {
  const globalStyle = useGlobalStyle();

  return (
    <View
      style={[
        styles.rowBetween,
        {
          alignItems: 'flex-start',
          marginHorizontal: scale(10),
        },
      ]}>
      <View
        style={[
          styles.rowBetween,
          {
            alignItems: 'center',
          },
        ]}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.fonts_SVN_Cherish,
            styles.textTitle,
            {
              color: accentColor,
              maxWidth: module.length > 20 ? WIDTH_SCREEN / 4 : '100%',
            },
          ]}>
          {lessonName}
        </Text>
        <View
          style={[
            styles.divider,
            {
              backgroundColor: accentColor,
            },
          ]}
        />
        <View style={styles.moduleContainer}>
          <Text
            adjustsFontSizeToFit
            style={[
              globalStyle.txtButton,
              styles.textModule,
              {color: accentColor},
            ]}
            numberOfLines={2}>
            {module}
          </Text>
          <Text
            adjustsFontSizeToFit
            style={[globalStyle.txtNote, styles.textPart, {color: accentColor}]}
            numberOfLines={2}>
            {part}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        {txtCountDown && (
          <View style={styles.countDown}>
            <FastImage
              style={StyleSheet.absoluteFill}
              resizeMode={FastImage.resizeMode.contain}
              source={assets.drug_bg}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              allowFontScaling
              style={styles.txtCountDown}>
              {txtCountDown}
            </Text>
          </View>
        )}
        <View style={styles.spacer} />
        <TouchableOpacity onPress={onPressFlower}>
          <CustomSwitchNew
            point={Math.max(score, 0)}
            value={false}
            onValueChange={() => {
              console.log('onValueChange');
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderLessonDetail;

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textTitle: {
    fontSize: scale(30),
    color: COLORS.GREEN_1C6349,
  },
  divider: {
    height: verticalScale(20),
    width: scale(3),
    borderRadius: scale(10),
    marginHorizontal: scale(8),
  },
  moduleContainer: {
    maxWidth: WIDTH_SCREEN / 2,
  },
  textModule: {
    fontSize: scale(12),
    color: COLORS.BLUE_258F78,
  },
  textPart: {
    fontSize: moderateScale(10),
    color: COLORS.BLUE_258F78,
    fontWeight: '300',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  countDown: {
    width: scale(60),
    aspectRatio: 4 / 2,
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtCountDown: {
    color: COLORS.WHITE_FBF8CC,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    fontSize: scale(16),
  },
  spacer: {
    height: verticalScale(5),
  },
});
