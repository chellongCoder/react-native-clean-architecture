import {View, StyleSheet} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AchievementLesson from './LessonComponent/AchievementLesson';
import WriteLesson from './LessonComponent/WriteLesson';
import ListenLesson from './LessonComponent/ListenLesson';
import FillBlankLesson from './LessonComponent/FillBlankLesson';
import TranslateLesson from './LessonComponent/TranslateLesson';
import GeometryLesson from './LessonComponent/GeometryLesson';
import MathLesson from './LessonComponent/MathLesson';
import {
  goBack,
  navigateScreen,
  pushScreen,
  resetNavigator,
} from 'src/core/presentation/navigation/actions/RootNavigationActions';
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
import {RouteParamsDone} from 'src/core/presentation/screens/DoneLessonScreen';
import {assets} from 'src/core/presentation/utils';
import {COLORS} from 'src/core/presentation/constants/colors';
import EssayLesson from './LessonComponent/EssayLesson';

enum LessonTypeE {
  ACHIEVEMENT,
  WRITE,
  VOCABULARY_LISTEN,
  VOCABULARY_FILL_BLANK,
  VOCABULARY_TRANSLATE,
  GEOMETRY,
  MATH,
  ESSAY = 'essay',
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
  trainingResult?: TResult[];
};

const LessonScreen = observer(() => {
  const lessons: LessonType[] = [
    // {lessonType: LessonTypeE.ACHIEVEMENT},
    {lessonType: LessonTypeE.VOWEL},
    {lessonType: LessonTypeE.ESSAY},
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
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const {selectedChild} = useAuthenticationStore();
  const {playSound, pauseSound} = useContext(SoundGlobalContext);

  const [lessonIndex, setLessonIndex] = useState(0);

  const [lessonState, setLessonState] = useStateCustom<TLessonState>({
    result: [],
  });
  const firstMiniTestTask = tasks.find(task => task.type === 'mini_test');

  const testTask = useMemo(() => {
    if (tasks[activeTaskIndex]?.type === 'mini_test') {
      return firstMiniTestTask;
    } else {
      return tasks[activeTaskIndex];
    }
  }, [activeTaskIndex, firstMiniTestTask, tasks]);

  const submitModule = useCallback(
    async (item: TResult) => {
      playSound(soundTrack.good_result);
      if (lessonState.result) {
        const totalResult = [...lessonState.result];
        totalResult.push(item);
        const res = await handlePostUserProgress(totalResult);
        if (res.message) {
          resetNavigator<RouteParamsDone>(
            STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN,
            {
              totalResult,
              andieImage: assets.andie_2,
              backgroundAndie: assets.background_barry,
              colorBgBookView: COLORS.GREEN_009C6F,
              title: 'you did great',
              note: 'Now it’s time for MINITEST. Try your best !',
              isMiniTest: true,
            },
          );
        }
      }
    },
    [handlePostUserProgress, lessonState.result, playSound],
  );

  const nextPart = useCallback(() => {
    navigateScreen<RouteParamsDone>(STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN, {
      totalResult: lessonState.trainingResult || [],
      andieImage: assets.andie_2,
      backgroundAndie: assets.background_barry,
      colorBgBookView: COLORS.GREEN_009C6F,
      title: 'you did great',
      note: `Now let’s practice again ${
        tasks.length - 1 - (activeTaskIndex + 1)
      } more times`,
    });
    setActiveTaskIndex(v => v + 1);
    setLessonIndex(0);
  }, [activeTaskIndex, lessonState.trainingResult, tasks.length]);

  const nextModule = useCallback(
    (answerSelected: string) => {
      // * check điều kiện là đang đến part mini test
      if (testTask?.type === firstMiniTestTask?.type) {
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
        /**
         * The lessonIndex >= (firstMiniTestTask?.question.length ?? 1) - 1 condition checks if the lessonIndex is greater than or equal to the index of the last question in the question array. If it is, the condition evaluates to true; otherwise, it evaluates to false.
         * If the condition evaluates to true, the code inside the if statement block will be executed. In this case, it calls the submitModule function and passes resultByAnswer as an argument.
         */
        if (lessonIndex >= (firstMiniTestTask?.question.length ?? 1) - 1) {
          submitModule(resultByAnswer);
          // return;
        }
        setLessonIndex(
          (lessonIndex + 1) % (firstMiniTestTask?.question.length ?? 1),
        );
      } else {
        // * check điều kiện là đang làm training
        playSound(soundTrack.menu_selection_sound);

        const resultByAnswer: TResult = {
          userId: selectedChild?._id,
          taskId: testTask?.question?.[lessonIndex].taskId,
          questionId: testTask?.question?.[lessonIndex]._id,
          status:
            answerSelected === testTask?.question?.[lessonIndex].correctAnswer
              ? 'completed'
              : 'failed',
          point: testTask?.question?.[lessonIndex].point,
        };

        if (
          answerSelected === testTask?.question?.[lessonIndex].correctAnswer
        ) {
          playSound(soundTrack.bell_ding_sound);
        } else {
          playSound(soundTrack.oh_no_sound);
        }

        setLessonState({
          trainingResult: [
            ...(lessonState.trainingResult || []),
            resultByAnswer,
          ],
        });

        /**
         * The lessonIndex >= (firstMiniTestTask?.question.length ?? 1) - 1 condition checks if the lessonIndex is greater than or equal to the index of the last question in the question array. If it is, the condition evaluates to true; otherwise, it evaluates to false.
         * If the condition evaluates to true, the code inside the if statement block will be executed. In this case, it calls the submitModule function and passes resultByAnswer as an argument.
         */
        if (lessonIndex >= (testTask?.question.length ?? 1) - 1) {
          nextPart();
          return;
        }
        setLessonIndex((lessonIndex + 1) % (testTask?.question.length ?? 1));
      }
    },
    [
      firstMiniTestTask?.question,
      firstMiniTestTask?.type,
      lessonIndex,
      lessonState.result,
      lessonState.trainingResult,
      nextPart,
      playSound,
      selectedChild?._id,
      setLessonState,
      submitModule,
      testTask?.question,
      testTask?.type,
    ],
  );

  useEffect(() => {
    const enterMiniTest = () => {
      console.log('Attempting to pause current sound');
      pauseSound();
      console.log('Attempting to play big bell sound');
      playSound(soundTrack.big_bell_sound);
    };

    enterMiniTest();

    return () => {
      console.log('Cleanup: attempting to pause current sound');
      pauseSound();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildLesson = () => {
    switch (testTask?.question?.[lessonIndex]?.type as LessonTypeE) {
      case LessonTypeE.ACHIEVEMENT:
        return (
          <AchievementLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={lessons.length}
          />
        );
      case LessonTypeE.ESSAY:
        return (
          <EssayLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
          />
        );
      case LessonTypeE.VOWEL:
        return (
          <VowelsLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
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
