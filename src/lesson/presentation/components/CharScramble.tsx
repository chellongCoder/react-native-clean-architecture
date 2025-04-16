/* eslint-disable react-native/no-inline-styles */
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
} from 'react';
import {COLORS} from 'src/core/presentation/constants/colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';

type Props = {
  content?: string;
  listChar?: string | string[];
  learningTimer?: number;
  onAnswerChanged?: (answer: string) => void;
  questionStyle?: StyleProp<TextStyle>;
  answerStyle?: StyleProp<TextStyle>;
};

export type CharScrambleRep = {
  reset: () => void;
};

const CharScramble = forwardRef<CharScrambleRep, Props>(
  (
    {
      content,
      listChar,
      learningTimer,
      onAnswerChanged,
      questionStyle,
      answerStyle,
    },
    ref,
  ) => {
    const [answerSelectedChars, setAnswerSelectedChars] = useState<string[]>(
      [],
    );
    const [selectedStack, setSelectedStack] = useState<
      {index: number; indexFill: number}[]
    >([]);

    const listCharArray = useMemo(
      () => (typeof listChar === 'string' ? listChar.split('') : listChar),
      [listChar],
    );

    const answerSelected = useMemo(
      () => answerSelectedChars.join(''),
      [answerSelectedChars],
    );

    const onPressItem = useCallback(
      (char: string, index: number) => {
        const stackItem = selectedStack.find(v => v.index === index);
        if (stackItem) {
          answerSelectedChars[stackItem.indexFill] = '_';
          setAnswerSelectedChars([...answerSelectedChars]);
          setSelectedStack(
            selectedStack.filter(v => v.index !== stackItem.index),
          );
        } else {
          const indexEmpty = answerSelectedChars.findIndex(v => v === '_');
          answerSelectedChars[indexEmpty] = char;
          setAnswerSelectedChars([...answerSelectedChars]);
          selectedStack.push({index: index, indexFill: indexEmpty});
          setSelectedStack([...selectedStack]);
        }
      },
      [selectedStack, answerSelectedChars],
    );

    useImperativeHandle(ref, () => ({
      reset() {
        setAnswerSelectedChars([]);
        setSelectedStack([]);
      },
    }));

    useEffect(() => {
      onAnswerChanged?.(answerSelected);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answerSelected]);

    useEffect(() => {
      if (content) {
        // First, remove single spaces between underscores
        let modifiedContent = content.replace(/(?<=_)\s(?=_)/g, '');
        // Then, reduce sequences of more than one space to a single space
        modifiedContent = modifiedContent.replace(/\s{2,}/g, ' ');
        setAnswerSelectedChars(modifiedContent.split(''));
      }
    }, [content, listChar]);
    return (
      <View style={[styles.boxSelected]}>
        <Text
          style={[
            styles.fonts_SVN_Cherish,
            styles.textQuestion,
            styles.textGreen,
            styles.mt8,
            questionStyle,
          ]}>
          {answerSelected}
        </Text>
        <View style={[styles.wapper, styles.fill]}>
          {listCharArray?.map((e, i) => {
            const bg = selectedStack.find(v => v.index === i)
              ? '#66C270'
              : '#F2B559';
            const length = listChar?.length ?? 2;
            const size = Math.min(
              (WIDTH_SCREEN - 80) / (length / 2),
              verticalScale(44),
            );
            return (
              <TouchableOpacity
                key={i}
                onPress={() => onPressItem(e, i)}
                style={[
                  styles.boxVowel,
                  {
                    backgroundColor: bg,
                    height: size,
                    width: size,
                  },
                ]}>
                <Text style={[styles.textVowel, answerStyle]}>{e}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {!!learningTimer && (
          <View
            style={[
              styles.boxSelected,
              {
                position: 'absolute',
                zIndex: 999,
                width: '100%',
                height: '100%',
                opacity: 0.7,
              },
            ]}
          />
        )}
      </View>
    );
  },
);

export default CharScramble;

const styles = StyleSheet.create({
  boxSelected: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    height: verticalScale(220),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  mt8: {
    marginTop: verticalScale(8),
  },
  textColor: {
    color: '#1C6349',
  },
  textQuestion: {
    fontSize: verticalScale(34),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
  },
  textGreen: {
    color: '#258F78',
  },
  txtWhite: {
    color: 'white',
  },
  wapper: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  boxVowel: {
    width: 56,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 6,
  },
  textVowel: {
    fontFamily: FontFamily.SVNCherishMoment,
    color: '#FBF8CC',
    fontSize: 24,
    fontWeight: '400',
    paddingTop: 8,
  },
});
