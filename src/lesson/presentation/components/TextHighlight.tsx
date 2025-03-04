import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import React, {useMemo} from 'react';
import {verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';

type Props = {
  description: string;
  content: string;
  style?: StyleProp<TextStyle>;
  styleHighlight?: StyleProp<TextStyle>;
};

const TextHighlight = ({
  description,
  content,
  style,
  styleHighlight,
}: Props) => {
  const splitText = useMemo(() => {
    const list = ` ${description} `.split(content);
    return list.flatMap((e, i) => {
      if (i === list.length - 1) {
        return e;
      }
      return [e, content];
    });
  }, [description, content]);

  return (
    <Text style={[styles.textQuestion, style]}>
      {splitText.map(e => {
        return (
          <Text
            style={
              content !== description && e === content
                ? [{fontWeight: 'bold'}, styleHighlight]
                : {}
            }>
            {e}
          </Text>
        );
      })}
    </Text>
  );
};

export default TextHighlight;

const styles = StyleSheet.create({
  textQuestion: {
    fontSize: verticalScale(15),
    textAlign: 'left',
    color: COLORS.BLUE_258F78,
  },
});
