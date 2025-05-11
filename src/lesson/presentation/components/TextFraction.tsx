import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TextStyle, StyleProp} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';

type Props = {
  whole: number;
  numerator: number;
  denominator: number;
  textStyle?: StyleProp<TextStyle>;
};

const TextFraction = ({whole, numerator, denominator, textStyle}: Props) => {
  const styleMap = useMemo(() => {
    if (Array.isArray(textStyle)) {
      return textStyle.reduce((acc: TextStyle, style) => {
        if (style && typeof style === 'object') {
          return {...acc, ...style};
        }
        return acc;
      }, {} as TextStyle);
    }
    return textStyle;
  }, [textStyle]);
  const fontSize = (styleMap as TextStyle)?.fontSize || scale(14);
  const numeratorLength = numerator.toString().length * (fontSize * 0.4); // Scale with fontSize
  const denominatorLength = denominator.toString().length * (fontSize * 0.4);
  const dividerWidth = Math.max(numeratorLength, denominatorLength, fontSize);

  const dividerColor =
    styleMap && (styleMap as TextStyle).color
      ? (styleMap as TextStyle).color
      : COLORS.WHITE_FFFBE3;

  return (
    <View style={styles.container}>
      {whole > 0 && (
        <View style={styles.wholeContainer}>
          <Text style={[styles.whole, textStyle]}>{whole}</Text>
        </View>
      )}
      <View
        style={[styles.fraction, {marginLeft: whole > 0 ? fontSize * 0.2 : 0}]}>
        <Text style={[styles.numerator, textStyle]}>{numerator}</Text>
        <View
          style={[
            styles.divider,
            {
              width: dividerWidth,
              backgroundColor: dividerColor,
              height: Math.max(1, fontSize * 0.08), // Scale divider height
              marginVertical: fontSize * 0.15,
            },
          ]}
        />
        <Text style={[styles.denominator, textStyle]}>{denominator}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20,
  },
  wholeContainer: {
    justifyContent: 'center',
  },
  whole: {
    marginRight: 0,
    fontSize: scale(14),
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.WHITE_FFFBE3,
  },
  fraction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numerator: {
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontSize: scale(14),
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.WHITE_FFFBE3,
  },
  denominator: {
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontSize: scale(14),
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.WHITE_FFFBE3,
  },
  divider: {
    backgroundColor: 'black',
  },
});

export default TextFraction;
