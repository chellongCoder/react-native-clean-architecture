import {StyleSheet} from 'react-native';
import {FontFamily} from './useFonts';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from '../utils/colors';

export default function useGlobalStyle() {
  return StyleSheet.create({
    txtNote: {
      fontSize: moderateScale(8),
      fontFamily: FontFamily.Eina01Regular,
      lineHeight: verticalScale(10),
      color: COLORS.BACKGROUND,
    },
    txtLabel: {
      fontSize: moderateScale(15),
      fontFamily: FontFamily.Eina01Bold,
    },
    txtWord: {
      fontSize: moderateScale(40),
      fontFamily: FontFamily.SVNCherishMoment,
    },
    txtModule: {
      fontSize: moderateScale(20),
      fontFamily: FontFamily.SVNCherishMoment,
    },
    txtButton: {
      fontSize: moderateScale(10),
      fontFamily: FontFamily.Eina01Bold,
    },
    marginVertical: {
      marginTop: verticalScale(8),
    },
    heightElement: {
      height: verticalScale(64),
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
  });
}
