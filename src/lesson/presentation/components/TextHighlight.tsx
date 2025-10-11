import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import React, {useMemo} from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';

type Props = {
  description: string;
  content: string | string[];
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
    if (Array.isArray(content)) {
      // Create a regex pattern that matches any of the content strings
      const pattern = content
        .map(str =>
          str.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        )
        .join('|');

      const regex = new RegExp(`(${pattern})`, 'g');

      // Split by the regex and keep the separators
      const parts = description
        ? description.split(regex)
        : content.map(e => e.toLocaleLowerCase());

      return parts.map(part => ({
        text: part,
        highlight: content
          .map(e => e.toLocaleLowerCase())
          .includes(part.toLocaleLowerCase()),
      }));
    } else {
      // Original logic for string content
      const list = description
        ? ` ${description} `.split(content)
        : content.split(content).map(e => e.toLocaleLowerCase());
      return list.flatMap((e, i) => {
        if (i === list.length - 1) {
          return [{text: e, highlight: false}];
        }
        return [
          {text: e, highlight: false},
          {text: content, highlight: true},
        ];
      });
    }
  }, [description, content]);

  return (
    <Text style={[styles.textQuestion, style]}>
      {splitText.map((part, index) => {
        return (
          <Text
            key={index}
            style={
              part.highlight ? [{fontWeight: 'bold'}, styleHighlight] : {}
            }>
            {part.text}
          </Text>
        );
      })}
    </Text>
  );
};

export default TextHighlight;

const styles = StyleSheet.create({
  textQuestion: {
    fontSize: moderateScale(15),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
  },
});
