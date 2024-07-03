import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import AchievementLesson from './LessonComponent/AchievementLesson';
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
import {observer} from 'mobx-react';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import VowelsLesson from './LessonComponent/VowelsLesson';

enum LessonTypeE {
  ACHIEVEMENT,
  VOWEL,
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

const LessonScreen = observer(() => {
  const lessons: LessonType[] = [
    {lessonType: LessonTypeE.ACHIEVEMENT},
    {lessonType: LessonTypeE.VOWEL},
    {lessonType: LessonTypeE.WRITE},
    {lessonType: LessonTypeE.VOCABULARY_LISTEN},
    {lessonType: LessonTypeE.VOCABULARY_FILL_BLANK},
    {lessonType: LessonTypeE.VOCABULARY_TRANSLATE},
    {lessonType: LessonTypeE.GEOMETRY},
    {lessonType: LessonTypeE.MATH},
  ];
  const lessonStore = useLessonStore();

  const [lessonIndex, setLessonIndex] = useState(0);

  const nextModule = () => {
    if (lessonIndex >= lessons.length - 1) {
      alertMessage(
        'Important message',
        'You reached 75 point so that you archived 30minutes free time to use another apps',
      );
      resetNavigator(STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN);
    }
    lessonStore.setIsShow(true);
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
      case LessonTypeE.VOWEL:
        return (
          <VowelsLesson
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
            nextModule={nextModule}
            totalModule={lessons.length}
          />
        );
    }
    return <View />;
  };

  return <View style={[styles.fill]}>{buildLesson()}</View>;
});

export default withProviders(LessonStoreProvider)(LessonScreen);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
