import {StyleSheet} from 'react-native';
import {COLORS} from './colors';

export const TYPOGRAPHY = {
  FAMILY: {
    ROBOTO: 'Roboto-Regular',
    ROBOTO_BOLD: 'Roboto-Bold',
  },
  SIZE: {
    h1: 40,
    h2: 32,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 15,
    body1: 16,
    body2: 14,
    caption: 12,
    caption2: 10,
    small: 10,
    small2: 8,
  },
};

export const CustomTextStyle = StyleSheet.create({
  h1: {
    fontSize: TYPOGRAPHY.SIZE.h1,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 44,
    color: COLORS.PRIMARY,
    fontWeight: '400',
  },
  h1_bold: {
    fontSize: TYPOGRAPHY.SIZE.h1,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO_BOLD,
    lineHeight: 44,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  h2: {
    fontSize: TYPOGRAPHY.SIZE.h2,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 36,
    color: COLORS.PRIMARY,
    fontWeight: '400',
  },
  h3: {
    fontSize: TYPOGRAPHY.SIZE.h3,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 36,
    color: COLORS.PRIMARY,
    fontWeight: '400',
  },
  h4: {
    fontSize: TYPOGRAPHY.SIZE.h4,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 24,
    color: COLORS.PRIMARY,
    fontWeight: '400',
  },
  h4_bold: {
    fontSize: TYPOGRAPHY.SIZE.h4,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO_BOLD,
    lineHeight: 24,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  h5: {
    fontSize: TYPOGRAPHY.SIZE.h5,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 32,
    color: COLORS.PRIMARY,
    fontWeight: '400',
  },
  h5_bold: {
    fontSize: TYPOGRAPHY.SIZE.h5,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO_BOLD,
    lineHeight: 32,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  h6: {
    fontSize: TYPOGRAPHY.SIZE.h6,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 24,
    fontWeight: '400',
  },
  body1: {
    fontSize: TYPOGRAPHY.SIZE.body1,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 22,
    color: COLORS.PRIMARY,
    fontWeight: '400',
  },
  body1_bold: {
    fontSize: TYPOGRAPHY.SIZE.body1,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO_BOLD,
    lineHeight: 22,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  body2: {
    fontSize: TYPOGRAPHY.SIZE.body2,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 20,
    color: COLORS.PRIMARY,
    fontWeight: '400',
  },
  caption: {
    fontSize: TYPOGRAPHY.SIZE.caption,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 20,
    color: COLORS.PRIMARY,
    fontWeight: '400',
  },
  captionBold: {
    fontSize: TYPOGRAPHY.SIZE.caption,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 20,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  smallBold: {
    fontSize: TYPOGRAPHY.SIZE.small,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO_BOLD,
    lineHeight: 20,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  smallNormal: {
    fontSize: TYPOGRAPHY.SIZE.small,
    fontFamily: TYPOGRAPHY.FAMILY.ROBOTO,
    lineHeight: 20,
    color: COLORS.PRIMARY,
    fontWeight: '400',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  center: {
    textAlign: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
