import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import WriteLesson from './LessonComponent/WriteLesson';
import ListenLesson from './LessonComponent/ListenLesson';
import FillBlankLesson from './LessonComponent/FillBlankLesson';
import TranslateLesson from './LessonComponent/TranslateLesson';
import GeometryLesson from './LessonComponent/GeometryLesson';
import MathLesson from './LessonComponent/MathLesson';
import {alertMessage} from 'src/core/presentation/utils/alert';
import {resetNavigator} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import AchievementLesson from './LessonComponent/AchievementLesson';

enum LessonTypeE {
  ACHIEVEMENT,
  WRITE,
  VOCABULARY_LISTEN,
  VOCABULARY_FILL_BLANK,
  VOCABULARY_TRANSLATE,
  GEOMETRY,
  MATH,
}

type LessonType = {
  lessonType: LessonTypeE;
};

const LessonScreen = () => {
  const lessons: LessonType[] = [
    {lessonType: LessonTypeE.ACHIEVEMENT},
    {lessonType: LessonTypeE.WRITE},
    {lessonType: LessonTypeE.VOCABULARY_LISTEN},
    {lessonType: LessonTypeE.VOCABULARY_FILL_BLANK},
    {lessonType: LessonTypeE.VOCABULARY_TRANSLATE},
    {lessonType: LessonTypeE.GEOMETRY},
    {lessonType: LessonTypeE.MATH},
  ];

  const [lessonIndex, setLessonIndex] = useState(0);

  const nextModule = () => {
    if (lessonIndex >= lessons.length - 1) {
      alertMessage(
        'Important message',
        'You reached 75 point so that you archived 30minutes free time to use another apps',
      );
      resetNavigator(STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN);
    }
    setLessonIndex((lessonIndex + 1) % lessons.length);
  };

  const buildLesson = () => {
    switch (lessons[lessonIndex]?.lessonType) {
      case LessonTypeE.ACHIEVEMENT:
        return (
          <AchievementLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={lessons.length}
          />
        );
      case LessonTypeE.WRITE:
        return (
          <WriteLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={lessons.length}
          />
        );
      case LessonTypeE.VOCABULARY_LISTEN:
        return (
          <ListenLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={lessons.length}
          />
        );
      case LessonTypeE.VOCABULARY_FILL_BLANK:
        return (
          <FillBlankLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={lessons.length}
          />
        );
      case LessonTypeE.VOCABULARY_TRANSLATE:
        return (
          <TranslateLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={lessons.length}
          />
        );
      case LessonTypeE.GEOMETRY:
        return (
          <GeometryLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={lessons.length}
          />
        );
      case LessonTypeE.MATH:
        return (
          <MathLesson
            moduleIndex={lessonIndex}
            nextModule={() => {
              alertMessage(
                'Important message',
                'You reached 60 point so that you archived 30minutes free time to use another apps',
              );
              resetNavigator(STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN);
            }}
            totalModule={lessons.length}
          />
      );
    }
  }
  const [layoutIndex, setLayoutIndex] = useState(0);

  const layout = listLayouts[layoutIndex];

  const nextModule = () => {
    setLayoutIndex((layoutIndex + 1) % listLayouts.length);
    lessonStore.setIsShow(true);
  };

  return (
    <View
      style={[
        styles.screen,
        {paddingTop: insets.top, backgroundColor: layout.backgroundColor},
      ]}>
      <View style={[styles.ph24, styles.container]}>
        <View style={[styles.rowBetween]}>
          <View>
            <Text style={[styles.fonts_SVN_Cherish, styles.textTitle]}>
              VIETNAMESE
            </Text>
            <Text style={[styles.fonts_SVN_Cherish, styles.textModule]}>
              {layout.module}
            </Text>
          </View>
          <View style={styles.alightEnd}>
            <View style={[styles.boxPrice]}>
              <Text style={[styles.fonts_SVN_Cherish, styles.textPrice]}>
                FREE
              </Text>
              <IconDiamond />
            </View>
            <View style={styles.rowAlignCenter}>
              <Text style={[styles.fonts_SVN_Cherish, styles.textPrice]}>
                150
              </Text>
              <IconStar />
            </View>
          </View>
        </View>
        <View style={[styles.boxQuestion, styles.pb32]}>
          {layout.buildQuestion}
        </View>
        <View style={[styles.tabs]}>
          {Array.from({length: listLayouts.length}, (_, i) => {
            const bg =
              i < layoutIndex
                ? 'white'
                : i === layoutIndex
                ? '#F2B559'
                : '#258F78';
            return <Dotline key={i} bg={bg} />;
          })}
        </View>
      </View>
      <View style={[styles.h450]}>
        <View style={styles.backgroundAnswer}>
          <View
            style={[
              styles.backgroundLeft,
              {backgroundColor: layout.backgroundAnswerColor},
            ]}
          />
          <View
            style={[
              styles.backgroundRight,
              {backgroundColor: layout.backgroundAnswerColor},
            ]}
          />
        </View>
        <View style={[styles.boxAnswer]}>{layout.buildAnswer}</View>
      </View>
    </View>
  );
});

const Dotline = ({bg}: {bg: string}) => {
  return <View style={[styles.dotline, {backgroundColor: bg}]} />;
};

export default withProviders(LessonStoreProvider)(LessonScreen);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
