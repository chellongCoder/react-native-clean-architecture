import {View, StyleSheet} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import AchievementLesson from './LessonComponent/AchievementLesson';
import WriteLesson from './LessonComponent/WriteLesson';
import ListenLesson from './LessonComponent/ListenLesson';
import FillBlankLesson from './LessonComponent/FillBlankLesson';
import TranslateLesson from './LessonComponent/TranslateLesson';
import GeometryLesson from './LessonComponent/GeometryLesson';
import MathLesson from './LessonComponent/MathLesson';
import {resetNavigator} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import {observer} from 'mobx-react';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import VowelsLesson from './LessonComponent/VowelsLesson';
import {useListQuestions} from 'src/hooks/useListQuestion';
import {RouteProp, useRoute} from '@react-navigation/native';
import useStateCustom from 'src/hooks/useStateCommon';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {SoundGlobalContext} from 'src/core/presentation/hooks/sound/SoundGlobalContext';
import {soundTrack} from 'src/core/presentation/hooks/sound/SoundGlobalProvider';

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

export type TResult = {
  userId?: string;
  taskId?: string;
  questionId?: string;
  status?: 'completed' | 'failed';
  point?: number;
};

export type TLessonState = {
  result?: TResult[];
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
  const {handlePostUserProgress} = useLessonStore();
  const {tasks} = useListQuestions(route?.lessonId);
  const {selectedChild} = useAuthenticationStore();
  const {playSound, pauseSound} = useContext(SoundGlobalContext);

  const [lessonIndex, setLessonIndex] = useState(0);
  const [lessonState, setLessonState] = useStateCustom<TLessonState>({
    result: [],
  });
  const firstMiniTestTask = tasks.find(task => task.type === 'mini_test');

  const submitModule = useCallback(
    async (item: TResult) => {
      playSound(soundTrack.good_result);
      if (lessonState.result) {
        const totalResult = [...lessonState.result];
        totalResult.push(item);
        const res = await handlePostUserProgress(totalResult);
        if (res.message) {
          resetNavigator(STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN, {
            totalResult,
          });
        }
      }
    },
    [handlePostUserProgress, lessonState.result, playSound],
  );

  const nextModule = useCallback(
    (answerSelected: string) => {
      playSound(soundTrack.menu_selection_sound);
      const resultByAnswer: TResult = {
        userId: selectedChild?._id,
        taskId: firstMiniTestTask?.question?.[lessonIndex].taskId,
        questionId: firstMiniTestTask?.question?.[lessonIndex]._id,
        status:
          answerSelected ===
          firstMiniTestTask?.question?.[lessonIndex].correctAnswer
            ? 'completed'
            : 'failed',
        point: firstMiniTestTask?.question?.[lessonIndex].point,
      };
      if (
        answerSelected ===
        firstMiniTestTask?.question?.[lessonIndex].correctAnswer
      ) {
        playSound(soundTrack.bell_ding_sound);
      } else {
        playSound(soundTrack.oh_no_sound);
      }
      setLessonState({
        result: [...(lessonState.result || []), resultByAnswer],
      });
      if (lessonIndex >= (firstMiniTestTask?.question.length ?? 1) - 1) {
        submitModule(resultByAnswer);
      }
      // lessonStore.setIsShow(true);
      setLessonIndex(
        (lessonIndex + 1) % (firstMiniTestTask?.question.length ?? 1),
      );
    },
    [
      firstMiniTestTask?.question,
      lessonIndex,
      lessonState.result,
      playSound,
      selectedChild?._id,
      setLessonState,
      submitModule,
    ],
  );

  useEffect(() => {
    const enterMiniTest = () => {
      pauseSound();
      playSound(soundTrack.big_bell_sound);
    };

    const cleanUp = enterMiniTest();

    return cleanUp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  };

  return <View style={[styles.fill]}>{buildLesson()}</View>;
});

export default withProviders(LessonStoreProvider)(LessonScreen);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
