import {
  ScrollView,
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
import {assets} from 'src/core/presentation/utils';
import FastImage from 'react-native-fast-image';

type Props = {
  content?: string;
  listChar?: string | string[];
  learningTimer?: number;
  onAnswerChanged?: (answer: string) => void;
  questionStyle?: StyleProp<TextStyle>;
  answerStyle?: StyleProp<TextStyle>;
  isCharacter?: boolean;
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
      isCharacter = true,
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
          answerSelectedChars[indexEmpty] = isCharacter ? char : char + ' ';
          setAnswerSelectedChars([...answerSelectedChars]);
          selectedStack.push({index: index, indexFill: indexEmpty});
          setSelectedStack([...selectedStack]);
        }
      },
      [selectedStack, answerSelectedChars, isCharacter],
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
            styles.mt8,
            questionStyle,
          ]}>
          {answerSelected}
          <TouchableOpacity
            style={styles.deleteContainer}
            onPress={() => {
              setAnswerSelectedChars(answerSelectedChars.map(_ => '_'));
              setSelectedStack([]);
            }}>
            <FastImage
              resizeMode="contain"
              source={assets.icon_delete}
              style={[{width: scale(20), height: scale(20)}]}
            />
          </TouchableOpacity>
        </Text>
        <ScrollView contentContainerStyle={[styles.wapper, styles.fill]}>
          {listCharArray?.map((e, i) => {
            const bg = selectedStack.find(v => v.index === i)
              ? '#66C270'
              : '#F2B559';

            return (
              <TouchableOpacity
                key={i}
                onPress={() => onPressItem(e, i)}
                style={[
                  styles.boxVowel,
                  {
                    backgroundColor: bg,
                    height: verticalScale(41),
                    width: scale(29),
                  },
                ]}>
                <Text
                  allowFontScaling
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  style={[styles.textVowel, answerStyle]}>
                  {e}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    marginTop: verticalScale(12),
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  boxVowel: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(4),
    marginVertical: scale(4),
  },
  textVowel: {
    fontFamily: FontFamily.SVNCherishMoment,
    color: '#FBF8CC',
    fontSize: scale(24),
    fontWeight: '400',
    paddingTop: scale(8),
  },
  deleteContainer: {
    padding: scale(8),
  },
});
