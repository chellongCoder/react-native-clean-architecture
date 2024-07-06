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
import {useListQuestions} from 'src/hooks/useListQuestion';
import {ParamListBase, RouteProp, useRoute} from '@react-navigation/native';

enum LessonTypeE {
  ACHIEVEMENT,
  WRITE,
  VOCABULARY_LISTEN,
  VOCABULARY_FILL_BLANK,
  VOCABULARY_TRANSLATE,
  GEOMETRY,
  MATH,
  VOWEL = 'fill_in_blank',
}

type LessonType = {
  lessonType: LessonTypeE;
};

const LessonScreen = observer(() => {
  const lessons: LessonType[] = [
    // {lessonType: LessonTypeE.ACHIEVEMENT},
    {lessonType: LessonTypeE.VOWEL},
    {lessonType: LessonTypeE.WRITE},
    {lessonType: LessonTypeE.VOCABULARY_LISTEN},
    {lessonType: LessonTypeE.VOCABULARY_FILL_BLANK},
    {lessonType: LessonTypeE.VOCABULARY_TRANSLATE},
    {lessonType: LessonTypeE.GEOMETRY},
    {lessonType: LessonTypeE.MATH},
  ];
  const route =
    useRoute<
      RouteProp<
        {Detail: {lessonId: string; lessonName: string; moduleName: string}},
        'Detail'
      >
    >().params;
  const lessonStore = useLessonStore();
  const {tasks} = useListQuestions(route?.lessonId);
  console.log(
    '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
  );
  console.log('🛠 LOG: 🚀 --> ~ LessonScreen ~ questions:', tasks);
  console.log(
    '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
  );
  const [lessonIndex, setLessonIndex] = useState(0);
  const firstMiniTestTask = tasks.find(task => task.type === 'mini_test');

  const nextModule = () => {
    if (lessonIndex >= (firstMiniTestTask?.question.length ?? 1) - 1) {
      alertMessage(
        'Important message',
        "You reached 100% of the minitest's question",
      );
      resetNavigator(STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN);
    }
    lessonStore.setIsShow(true);
    setLessonIndex(
      (lessonIndex + 1) % (firstMiniTestTask?.question.length ?? 1),
    );
  };

  const buildLesson = () => {
    switch (firstMiniTestTask?.question?.[lessonIndex]?.type as LessonTypeE) {
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
            totalModule={firstMiniTestTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={firstMiniTestTask}
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
