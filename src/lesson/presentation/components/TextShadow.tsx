import {StyleProp, TextStyle, Text} from 'react-native';
import React, {useMemo} from 'react';
import TextFraction from './TextFraction';
import {scale} from 'react-native-size-matters';

type Props = {
  type?: 'FRACTION' | 'TEXT';
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  textShadowColor?: string;
  whole?: number;
  numerator?: number;
  denominator?: number;
};

const TextShadow = (props: Props) => {
  const {style, children, type = 'TEXT', textShadowColor} = props;

  const styles = useMemo(() => {
    if (Array.isArray(style)) {
      return style.reduce((acc: TextStyle, s) => {
        if (s && typeof s === 'object') {
          return {...acc, ...s};
        }
        return acc;
      }, {} as TextStyle);
    }
    return style;
  }, [style]);

  const fontSize = (styles as TextStyle)?.fontSize || scale(14);

  const styleShadow = textShadowColor
    ? {
        textShadowColor: textShadowColor,
        textShadowOffset: {
          width: fontSize / 12,
          height: fontSize / 15,
        },
        textShadowRadius: 0.1,
      }
    : {};

  return type === 'FRACTION' ? (
    <TextFraction
      textStyle={
        Array.isArray(style) ? [...style, styleShadow] : [style, styleShadow]
      }
      denominator={props.denominator ?? 0}
      numerator={props.numerator ?? 0}
      whole={props.whole}
    />
  ) : (
    <Text style={[style, styleShadow]}>{children}</Text>
  );
};

export default TextShadow;
