import {View, StyleSheet} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import VowelsLesson, {VowelsRef} from './LessonComponent/VowelsLesson';
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
import {TRAINING_COUNT} from 'src/core/domain/enums/ModuleE';
import UseHintModal from 'src/core/presentation/components/UseHintModal';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from '../stores/LessonStore/LessonStore';
import PronunciationLesson from './LessonComponent/PronunciationLesson';

enum LessonTypeE {
  TEXT = 'text',
  CHOOSE_CORRECT_ANSWER = 'choose_correct_answer',
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_IN_BLANK = 'fill_in_blank',
  TRUE_FALSE = 'true_false',
  MATCHING = 'matching',
  ESSAY = 'essay',
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
  READING = 'reading',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
  READING_COMPREHENSION = 'reading_comprehension',
  WRITING = 'writing',
  CONVERSATION = 'conversation',
  PRONUNCIATION = 'pronunciation',
  TRANSLATION = 'translation',
  EXPLANATION = 'explanation',
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
  const vowelRef = useRef<VowelsRef>();
  const lessons: LessonType[] = [
    // {lessonType: LessonTypeE.ACHIEVEMENT},
    {lessonType: LessonTypeE.AUDIO},
    {lessonType: LessonTypeE.ESSAY},
    {lessonType: LessonTypeE.CHOOSE_CORRECT_ANSWER},
    {lessonType: LessonTypeE.CONVERSATION},
    {lessonType: LessonTypeE.EXPLANATION},
    {lessonType: LessonTypeE.FILL_IN_BLANK},
    {lessonType: LessonTypeE.GRAMMAR},
    {lessonType: LessonTypeE.PRONUNCIATION},
    {lessonType: LessonTypeE.READING},
    {lessonType: LessonTypeE.READING_COMPREHENSION},
    {lessonType: LessonTypeE.SPEAKING},
    {lessonType: LessonTypeE.TRANSLATION},
    {lessonType: LessonTypeE.TRUE_FALSE},
    {lessonType: LessonTypeE.VIDEO},
    {lessonType: LessonTypeE.WRITING},
  ];
  const route =
    useRoute<
      RouteProp<
        {Detail: {lessonId: string; lessonName: string; moduleName: string}},
        'Detail'
      >
    >().params;

  const lessonStore = lessonModuleContainer.getProvided(LessonStore);
  const {
    handlePostUserProgress,
    setTrainingCount,
    trainingCount,
    setCurrentQuestion,
    currentQuestion,
    isShowHint,
    toggleUseHint,
  } = lessonStore;

  const {tasks: apiTasks} = useListQuestions(route?.lessonId);

  const tasks = useMemo(() => {
    return apiTasks.map(t => {
      return {
        ...t,
        question: t.question.slice(0, 1),
        // question: t.question.slice(0, 5),
        // question: t.question,
      };
    });
  }, [apiTasks]);

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const {selectedChild, getUserProfile, setSelectedChild} =
    useAuthenticationStore();
  const {playSound, pauseSound, loopSound} = useContext(SoundGlobalContext);

  const [lessonIndex, setLessonIndex] = useState(0);

  const [lessonState, setLessonState] = useStateCustom<TLessonState>({
    result: [],
    trainingResult: [],
  });

  /**
   * Lấy ra mini test trong task của module
   */
  const firstMiniTestTask = tasks.find(task => task.type === 'mini_test');

  /**
   * Lấy ra task đang được làm
   */
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
              note: 'Good job!!! You pass the Minitest, \nnow app is unlocked !',
              isMiniTest: true,
              moduleName: route.moduleName,
              lessonName: route.lessonName,
              partName: testTask?.name,
            },
          );
        }
      }
    },
    [
      handlePostUserProgress,
      lessonState.result,
      playSound,
      route.lessonName,
      route.moduleName,
      testTask?.name,
    ],
  );

  const nextPart = useCallback(
    (trainingResult: TResult[]) => {
      console.log(
        '🛠 LOG: 🚀 --> ---------------------------------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log(
        '🛠 LOG: 🚀 --> ~ LessonScreen ~ trainingResult:',
        trainingResult,
        tasks?.[activeTaskIndex + 1],
      );
      console.log(
        '🛠 LOG: 🚀 --> ---------------------------------------------------------------🛠 LOG: 🚀 -->',
      );
      /**-----------------------
       * todo      sang part tiếp theo
       *  nếu check ra part tiếp theo là mini test
       *  * trừ đi 1 lần làm
       *------------------------**/
      if (
        tasks?.[activeTaskIndex + 1] === undefined ||
        tasks?.[activeTaskIndex + 1].type === firstMiniTestTask?.type
      ) {
        setTrainingCount(trainingCount - 1);

        /**-----------------------
         * todo      check lần làm
         *  nếu check lần làm chỉ còn  1 lần , tức là ở trên đã set training về 0
         *  * đi sang làm mini test
         *------------------------**/
        if (trainingCount === 1) {
          navigateScreen<RouteParamsDone>(
            STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN,
            {
              totalResult: trainingResult || [],
              andieImage: assets.andie_2,
              backgroundAndie: assets.background_barry,
              colorBgBookView: COLORS.GREEN_009C6F,
              title: 'you did great',
              note: 'Good job!!! Now it’s time for MINITEST. \nTry your best !',
              moduleName: route.moduleName,
              lessonName: route.lessonName,
              partName: testTask?.name,
              noMiniTest: !firstMiniTestTask,
            },
          );
          // * sang lần làm tiếp theo
          setActiveTaskIndex(v => v + 1);
          // * reset về câu đầu
          setLessonIndex(0);
          return;
        }

        let title = '';
        let note = '';
        if (trainingCount === TRAINING_COUNT) {
          // * nếu làm xong lần 1
          title = 'amazing'; // * title của câu cảm xúc ở màn done screen
          note = 'You’re doing great.'; // * câu note ở dưới
        } else if (trainingCount === 2) {
          // * nếu làm xong lần 2
          title = 'excellent';
          note = 'You can do it !!';
        }

        navigateScreen<RouteParamsDone>(
          STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN,
          {
            totalResult: trainingResult || [],
            andieImage: assets.andie_2,
            backgroundAndie: assets.background_barry,
            colorBgBookView: COLORS.GREEN_009C6F,
            title,
            countTime: `${trainingCount - 1} more time`,
            note,
            moduleName: route.moduleName,
            lessonName: route.lessonName,
            partName: testTask?.name,
          },
        );
        // * set kết quả training về rỗng
        setLessonState({trainingResult: []});
        // * làm lại từ part đầu
        setActiveTaskIndex(0);
      } else {
        // * nếu task tiếp theo ko phải mini test thì tiến tới làm part tiếp theo
        setActiveTaskIndex(v1 => v1 + 1);
      }
      setLessonIndex(0); // * reset về câu 0
    },
    [
      tasks,
      activeTaskIndex,
      firstMiniTestTask,
      setTrainingCount,
      trainingCount,
      route.moduleName,
      route.lessonName,
      testTask?.name,
      setLessonState,
    ],
  );

  const nextModule = useCallback(
    (answerSelected: string) => {
      // * bỏ đi các khoảng trống ở câu trả lời
      const finalAnswer = answerSelected.trim();

      // * check điều kiện là đang đến part mini test
      if (testTask?.type === firstMiniTestTask?.type) {
        playSound(soundTrack.menu_selection_sound);
        const resultByAnswer: TResult = {
          userId: selectedChild?._id,
          taskId: firstMiniTestTask?.question?.[lessonIndex].taskId,
          questionId: firstMiniTestTask?.question?.[lessonIndex]._id,
          status:
            finalAnswer ===
            firstMiniTestTask?.question?.[lessonIndex].correctAnswer
              ? 'completed'
              : 'failed',
          point: firstMiniTestTask?.question?.[lessonIndex].point,
        };

        // * set vào mảng kết quả đã trả lời
        setLessonState({
          result: [...(lessonState.result || []), resultByAnswer],
        });
        /**
         * The lessonIndex >= (firstMiniTestTask?.question.length ?? 1) - 1 condition checks if the lessonIndex is greater than or equal to the index of the last question in the question array. If it is, the condition evaluates to true; otherwise, it evaluates to false.
         * If the condition evaluates to true, the code inside the if statement block will be executed. In this case, it calls the submitModule function and passes resultByAnswer as an argument.
         */
        if (lessonIndex >= (firstMiniTestTask?.question.length ?? 1) - 1) {
          submitModule(resultByAnswer);
          return;
        }
        // * di tới câu tiếp theo
        setLessonIndex(v => v + 1);
      } else {
        // * check điều kiện là đang làm training
        playSound(soundTrack.menu_selection_sound);

        const resultByAnswer: TResult = {
          userId: selectedChild?._id,
          taskId: testTask?.question?.[lessonIndex].taskId,
          questionId: testTask?.question?.[lessonIndex]._id,
          status: finalAnswer ? 'completed' : 'failed',
          point: testTask?.question?.[lessonIndex].point,
        };

        // * set câu trả lời vào mảng kết quả
        const _trainingResult = [
          ...(lessonState.trainingResult || []),
          resultByAnswer,
        ];
        setLessonState({
          trainingResult: _trainingResult,
        });

        isShowHint && toggleUseHint();

        /**
         * The lessonIndex >= (firstMiniTestTask?.question.length ?? 1) - 1 condition checks if the lessonIndex is greater than or equal to the index of the last question in the question array. If it is, the condition evaluates to true; otherwise, it evaluates to false.
         * If the condition evaluates to true, the code inside the if statement block will be executed. In this case, it calls the submitModule function and passes resultByAnswer as an argument.
         */
        if (lessonIndex >= (testTask?.question.length ?? 1) - 1) {
          nextPart(_trainingResult);
          return;
        }
        setLessonIndex(v => v + 1);
      }
    },
    [
      firstMiniTestTask?.question,
      firstMiniTestTask?.type,
      isShowHint,
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
      toggleUseHint,
    ],
  );

  const onUseHint = useCallback(async () => {
    toggleUseHint();
    if (selectedChild?.adsPoints) {
      try {
        await lessonStore.changeChildrenPointFlower({
          childId: selectedChild?._id ?? '',
          point: -2,
        });
        const profile = await getUserProfile();
        const currentChild = profile.data.children.find(
          child => selectedChild?._id === child._id,
        );

        if (currentChild) {
          setSelectedChild(currentChild);
        }
      } catch (error) {}
    }

    // * tự động chọn câu trả lời đúng
    vowelRef.current?.onChoiceCorrectedAnswer();
  }, [
    getUserProfile,
    lessonStore,
    selectedChild?._id,
    selectedChild?.adsPoints,
    setSelectedChild,
    toggleUseHint,
  ]);

  /**
   * pause lại các sound khác
   * play big bell sound khi vào làm bài
   */
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
      pauseSound(); // * pausse tất cả các sound khi làm bài
      loopSound(soundTrack.ukulele_music); // * lặp lại bài background
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      setCurrentQuestion({
        lessonId: route.lessonId,
        activeTaskIndex,
        questionIndex: lessonIndex,
      });
    };
  }, [activeTaskIndex, lessonIndex, route.lessonId, setCurrentQuestion]);

  /**----------------------
   *todo    Logic đi tới câu đã làm khi back lại
   *------------------------**/
  useEffect(() => {
    if (currentQuestion && currentQuestion.lessonId === route.lessonId) {
      setActiveTaskIndex(currentQuestion.activeTaskIndex);
      setLessonIndex(currentQuestion.questionIndex);
    } else {
      setTrainingCount(TRAINING_COUNT); // * set lại TRANING COUNT về ban đàu
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildLesson = () => {
    switch (testTask?.question?.[lessonIndex]?.type as LessonTypeE) {
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
      case LessonTypeE.PRONUNCIATION:
        return (
          <PronunciationLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            ref={vowelRef}
          />
        );
      case LessonTypeE.FILL_IN_BLANK:
        return (
          <VowelsLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            ref={vowelRef}
          />
        );
      // case LessonTypeE.ACHIEVEMENT:
      //   return (
      //     <AchievementLesson
      //       moduleIndex={lessonIndex}
      //       nextModule={nextModule}
      //       totalModule={lessons.length}
      //     />
      //   );
      // case LessonTypeE.WRITE:
      //   return (
      //     <WriteLesson
      //       moduleIndex={lessonIndex}
      //       nextModule={nextModule}
      //       totalModule={lessons.length}
      //     />
      //   );
      // case LessonTypeE.VOCABULARY_LISTEN:
      //   return (
      //     <ListenLesson
      //       moduleIndex={lessonIndex}
      //       nextModule={nextModule}
      //       totalModule={lessons.length}
      //     />
      //   );
      // case LessonTypeE.VOCABULARY_FILL_BLANK:
      //   return (
      //     <FillBlankLesson
      //       moduleIndex={lessonIndex}
      //       nextModule={nextModule}
      //       totalModule={lessons.length}
      //     />
      //   );
      // case LessonTypeE.VOCABULARY_TRANSLATE:
      //   return (
      //     <TranslateLesson
      //       moduleIndex={lessonIndex}
      //       nextModule={nextModule}
      //       totalModule={lessons.length}
      //     />
      //   );
      // case LessonTypeE.GEOMETRY:
      //   return (
      //     <GeometryLesson
      //       moduleIndex={lessonIndex}
      //       nextModule={nextModule}
      //       totalModule={lessons.length}
      //     />
      //   );
      // case LessonTypeE.MATH:
      //   return (
      //     <MathLesson
      //       moduleIndex={lessonIndex}
      //       nextModule={nextModule}
      //       totalModule={lessons.length}
      //     />
      //   );
      default:
        return <></>;
    }
  };

  const buildHint = () => {
    return (
      <View style={styles.hint}>
        <UseHintModal
          onClose={() => {
            toggleUseHint();
          }}
          onUseHint={onUseHint}
        />
      </View>
    );
  };

  return (
    <View style={[styles.fill]}>
      {buildLesson()}
      {isShowHint && buildHint()}
    </View>
  );
});

export default withProviders(LessonStoreProvider)(LessonScreen);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  hint: {
    position: 'absolute',
    zIndex: 999,
    width: '100%',
    height: '100%',
  },
});
