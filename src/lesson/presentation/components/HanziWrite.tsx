import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {Button, StyleSheet, View, Text, Alert} from 'react-native';
import {SkPath} from '@shopify/react-native-skia';
import {HanziWriter, useHanziWriter} from '@jamsch/react-native-hanzi-writer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {COLORS} from 'src/core/presentation/constants/colors';
import {scale} from 'react-native-size-matters';

type Props = {
  text?: {
    content: string;
    color?: string;
    opacity?: number;
    font?: {
      name: string;
      require: number;
    };
  };
  matchDistance?: number;
  backgroundColor?: string;
  matchPoints?: {x: number; y: number; passed?: boolean}[];
};

export type HanziWriteRef = {
  reset(): void;
  getResult(): {
    strokesNumber: number;
    maxDistance: number;
    paths: SkPath[];
    matchPointNumber: number;
  };
};

const HanziWrite = forwardRef<HanziWriteRef, Props>((props: Props, ref) => {
  const writer = useHanziWriter({
    character: props.text?.content ?? '',
    // (Optional) This is where you would load the character data from a CDN
    loader(char) {
      return fetch(
        `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`,
      ).then(res => res.json());
    },
  });

  const reset = () => {
    //
  };

  useEffect(() => {
    startQuiz();
  });

  useImperativeHandle(ref, () => ({
    reset,
    getResult: () => ({
      maxDistance: 0,
      paths: [],
      matchPointNumber: 0,
      strokesNumber: 0,
    }),
  }));

  const quizActive = writer.quiz.useStore(s => s.active);

  const startQuiz = () => {
    writer.quiz.start({
      /** Optional. Default: 1. This can be set to make stroke grading more or less lenient. Closer to 0 the more strictly strokes are graded. */
      leniency: 1,
      /** Optional. Default: 0. */
      quizStartStrokeNum: 0,
      /** Highlights correct stroke (uses <QuizMistakeHighlighter />) after incorrect attempts. Set to `false` to disable. */
      showHintAfterMisses: 1,
      onComplete({totalMistakes}) {
        console.log(
          `Quiz complete! You made a total of ${totalMistakes} mistakes`,
          Alert.alert(
            `Quiz complete! You made a total of ${totalMistakes} mistakes`,
          ),
        );
      },
      onCorrectStroke() {
        console.log('onCorrectStroke');
        Alert.alert('Correct stroke!');
      },
      onMistake(strokeData) {
        console.log('onMistake', strokeData);
      },
    });
  };

  return (
    <View
      style={[
        styles.container,
        props.backgroundColor ? {backgroundColor: props.backgroundColor} : null,
      ]}>
      <GestureHandlerRootView style={{}}>
        <HanziWriter
          writer={writer}
          // Optional, render out your loading UI
          loading={<Text>Loading...</Text>}
          // Optional, render out an error UI in case the fetch call fails
          error={
            <View>
              <Text>Error loading character. </Text>
              <Button title="Refetch" onPress={writer.refetch} />
            </View>
          }
          style={{alignSelf: 'center'}}>
          {/** Optional, grid lines to help draw the character */}
          <HanziWriter.Outline color="#ddd" />
          <HanziWriter.GridLines color="#ddd" />
          <HanziWriter.Svg>
            {/** The outline is laid under the character */}
            <HanziWriter.Outline color="#ccc" />
            {/** The character is displayed on top. Animations run here. Quizzing will hide it */}
            <HanziWriter.Character color="#555" radicalColor="green" />
            {/** Quiz strokes display after every correct stroke in quiz mode */}
            <HanziWriter.QuizStrokes />
            {/** The mistake highligher will animate and fade out a stroke in quiz mode */}
            <HanziWriter.QuizMistakeHighlighter
              color={COLORS.PRIMARY}
              strokeDuration={400}
            />
          </HanziWriter.Svg>
        </HanziWriter>
      </GestureHandlerRootView>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF8CC',
    borderRadius: scale(20),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chiSo: {
    padding: 8,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  space: {
    height: 20,
  },
});

export default HanziWrite;
