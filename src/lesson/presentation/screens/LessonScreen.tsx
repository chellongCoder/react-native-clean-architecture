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
import VowelsLesson from './LessonComponent/VowelsLesson';
import {useListQuestions} from 'src/hooks/useListQuestion';
import {RouteProp, useRoute} from '@react-navigation/native';
import useStateCustom from 'src/hooks/useStateCommon';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {SoundGlobalContext} from 'src/core/presentation/hooks/sound/SoundGlobalContext';
import {soundTrack} from 'src/core/presentation/hooks/sound/SoundGlobalProvider';
import {RouteParamsDone} from 'src/core/presentation/screens/DoneLessonScreen';
import EssayLesson from './LessonComponent/EssayLesson';
import {TRAINING_COUNT} from 'src/core/domain/enums/ModuleE';
import UseHintModal from 'src/core/presentation/components/UseHintModal';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from '../stores/LessonStore/LessonStore';
import PronunciationLesson from './LessonComponent/PronunciationLesson';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {coreModuleContainer} from 'src/core/CoreModule';
import {LessonRef} from '../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import ScienceLesson from './LessonComponent/ScienceLesson';
import OnBoardingScreen from 'src/core/presentation/screens/OnBoardingScreen';
import Math_MG2M4 from './LessonComponent/Math_MG2M4';
import English_EG4M23 from './LessonComponent/English_EG4M23';
import MultiPronunciationLesson from './LessonComponent/MultiPronunciationLesson';
import LatinLesson from './LessonComponent/LatinLesson';
import English_G5M16 from './LessonComponent/English_G5M16';
import English_G6M26 from './LessonComponent/English_G6M26';
import English_G3M20 from './LessonComponent/English_G3M20';
import Mandarin_G1M5 from './LessonComponent/Mandarin_G1M5';
import Mandarin_G2M25 from './LessonComponent/Mandarin_G2M25';
import Mandarin_G3M37 from './LessonComponent/Mandarin_G3M37';
import Mandarin_G4M27 from './LessonComponent/Mandarin_G4M27';
import Mandarin_G5M25 from './LessonComponent/Mandarin_G5M25';
import Mandarin_G6M31 from './LessonComponent/Mandarin_G6M31';
import Mandarin_Kindergarten from './LessonComponent/Mandarin_Kindergarten';
import Math_MG5M18 from './LessonComponent/Math_MG5M18';
import Math_MG6M15 from './LessonComponent/Math_MG6M15';
import Math_Kindergarten from './LessonComponent/Math_Kindergarten';
import Science_G0M1 from './LessonComponent/Science_G0M1';

export enum MathQuestionType {
  MATH_TEXT = 'math_text',
  MATH_CHOOSE_CORRECT_ANSWER = 'MATH_MG4M30',
  MATH_MULTIPLE_CHOICE = 'math_multiple_choice',
  MATH_FILL_IN_BLANK = 'math_fill_in_blank',
  MATH_TRUE_FALSE = 'math_true_false',
  MATH_MATCHING = 'math_matching',
  MATH_ESSAY = 'math_essay',
  MATH_AUDIO = 'math_audio',
  MATH_IMAGE = 'math_image',
  MATH_VIDEO = 'math_video',
  MATH_READING = 'math_reading',
  MATH_LISTENING = 'math_listening',
  MATH_SPEAKING = 'math_speaking',
  MATH_GRAMMAR = 'math_grammar',
  MATH_VOCABULARY = 'math_vocabulary',
  MATH_READING_COMPREHENSION = 'math_reading_comprehension',
  MATH_WRITING = 'math_writing',
  MATH_CONVERSATION = 'math_conversation',
  MATH_PRONUNCIATION = 'math_pronunciation',
  MATH_TRANSLATION = 'math_translation',
  MATH_EXPLANATION = 'math_explanation',

  MathMG0M1 = 'MATH_G0M1',
  MathMG0M2 = 'MATH_G0M2',
  MathMG0M3 = 'MATH_G0M3',
  MathMG1M3 = 'Math_MG1M3',
  MathMG2M4 = 'MATH_MG2M4',
  MathMG3M8 = 'MATH_MG3M8',
  MathMG4M30 = 'MATH_MG4M30',
  MathMG5M18 = 'MATH_MG5M18',
  MathMG6M15 = 'MATH_MG6M15',
}

export enum LanguageE {
  ENGLISH_EG1M3 = 'ENGLISH_EG1M3',
  ENGLISHG2M12 = 'ENGLISHG2M12',
  ENGLISH_G3M20 = 'ENGLISH_G3M20',
  ENGLISH_EG4M23 = 'ENGLISH_G4M23',
  ENGLISH_G5M16 = 'ENGLISH_G5M16',
  ENGLISH_G6M26 = 'ENGLISH_G6M26',

  ENGLISH_EG0M1 = 'ENGLISH_EG0M1',
  ENGLISH_EG0M2 = 'ENGLISH_EG0M2',
  ENGLISH_EG0M3 = 'ENGLISH_EG0M3',

  MANDARIN_G1M4 = 'MANDARIN_G1M4',
  MANDARIN_G1M5 = 'MANDARIN_G1M5',
  MANDARIN_G1M6 = 'MANDARIN_G1M6',
  MANDARIN_G2M25 = 'MANDARIN_G2M25',
  MANDARIN_G3M37 = 'MANDARIN_G3M37',
  MANDARIN_G4M27 = 'MANDARIN_G4M27',
  MANDARIN_G5M25 = 'MANDARIN_G5M25',
  MANDARIN_G6M31 = 'MANDARIN_G6M31',
  MANDARIN_M0G1 = 'MANDARIN_M0G1',
  MANDARIN_M0G2 = 'MANDARIN_M0G2',
  MANDARIN_M0G3 = 'MANDARIN_M0G3',
}

export enum ScienceE {
  SCIENCE_G0M1 = 'SCIENCE_SG0M1',
  SCIENCE_G0M2 = 'SCIENCE_SG0M2',
}
export enum LessonTypeE {
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
  MATH = 'math',
  WRITE = 'write',
  SCIENCE = 'science',
  MIX_COLOR = 'mix_color',
}

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
  const vowelRef = useRef<LessonRef | null>(null);

  const route =
    useRoute<
      RouteProp<
        {Detail: {lessonId: string; lessonName: string; moduleName: string}},
        'Detail'
      >
    >().params;

  const lessonStore = lessonModuleContainer.getProvided(LessonStore);
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const {
    handlePostUserProgress,
    setTrainingCount,
    trainingCount,
    setCurrentQuestion,
    currentQuestion,
    isShowHint,
    toggleUseHint,
    getSetting,
  } = lessonStore;

  const {lessonSetting} = useHomeStore();

  const {tasks: apiTasks} = useListQuestions(route?.lessonId);

  const tasks = useMemo(() => {
    return apiTasks.map(t => {
      return {
        ...t,
        // question: t.question.slice(0, 1),
        // question: t.question.slice(0, 5),
        // question: shuffleArray(t.question),
        question: __DEV__ ? t.question.slice(0, 3) : t.question,
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

  const settings = useMemo(
    () => getSetting(lessonSetting),
    [getSetting, lessonSetting],
  );
  console.log('settings: ', settings);
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
              andieImage:
                item.status === 'completed'
                  ? env.IMAGE_BACKGROUND_BASE_API_URL +
                    lessonSetting?.figureSuccessImage
                  : env.IMAGE_BACKGROUND_BASE_API_URL +
                    lessonSetting?.figureFailImage,
              backgroundAndie:
                env.IMAGE_BACKGROUND_BASE_API_URL +
                lessonSetting?.backgroundImage,
              colorBgBookView: settings.backgroundAnswerColor,
              title: 'you did great',
              note: 'Good job!!! You pass the Minitest, \n now app is unlocked and you recieved 1 Sunflower. Check it in Achievement.',
              isMiniTest: true,
              moduleName: route.moduleName,
              lessonName: route.lessonName,
              partName: testTask?.name,
              type: testTask?.question?.[lessonIndex]?.type,
              module: testTask,
            },
          );
        }
      }
    },
    [
      env.IMAGE_BACKGROUND_BASE_API_URL,
      handlePostUserProgress,
      lessonIndex,
      lessonSetting?.backgroundImage,
      lessonSetting?.figureFailImage,
      lessonSetting?.figureSuccessImage,
      lessonState.result,
      playSound,
      route.lessonName,
      route.moduleName,
      settings.backgroundAnswerColor,
      testTask,
    ],
  );

  const nextPart = useCallback(
    (trainingResult: TResult[]) => {
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
              andieImage:
                env.IMAGE_BACKGROUND_BASE_API_URL +
                lessonSetting?.figureSuccessImage,
              backgroundAndie:
                env.IMAGE_BACKGROUND_BASE_API_URL +
                lessonSetting?.backgroundImage,
              colorBgBookView: settings.backgroundAnswerColor,
              title: 'you did great',
              note: 'Good job!!! Now it’s time for MINITEST. \nTry your best !',
              moduleName: route.moduleName,
              lessonName: route.lessonName,
              partName: testTask?.name,
              noMiniTest: !firstMiniTestTask,
              type: testTask?.question?.[lessonIndex]?.type,
              module: testTask,
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
            andieImage:
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage,
            backgroundAndie:
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.backgroundImage,
            colorBgBookView: settings.backgroundAnswerColor,
            title,
            countTime: `${trainingCount - 1} more time`,
            note,
            moduleName: route.moduleName,
            lessonName: route.lessonName,
            partName: testTask?.name,
            type: testTask?.question?.[lessonIndex]?.type,
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
      env.IMAGE_BACKGROUND_BASE_API_URL,
      lessonSetting?.figureSuccessImage,
      lessonSetting?.backgroundImage,
      settings.backgroundAnswerColor,
      route.moduleName,
      route.lessonName,
      testTask,
      lessonIndex,
      setLessonState,
    ],
  );

  const nextModule = useCallback(
    (answerSelected: string) => {
      console.log(
        '🛠 LOG: 🚀 --> --------------------------------------------------------------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log(
        '🛠 LOG: 🚀 --> ~ file: LessonScreen.tsx:345 ~ LessonScreen ~ answerSelected:',
        answerSelected,
      );
      console.log(
        '🛠 LOG: 🚀 --> --------------------------------------------------------------------------------------------🛠 LOG: 🚀 -->',
      );

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
            firstMiniTestTask?.question?.[lessonIndex].correctAnswer.toString()
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
    switch (
      testTask?.question?.[lessonIndex]?.type as
        | LessonTypeE
        | MathQuestionType
        | LanguageE
        | ScienceE
    ) {
      /**
       * * UI chung dành cho các module phát âm
       */
      case LanguageE.ENGLISHG2M12:
        return (
          <MultiPronunciationLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
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
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );

      /**----------------------
       *todo    các question cho môn Tiếng Anh
       *------------------------**/
      case LanguageE.ENGLISH_EG0M1:
      case LanguageE.ENGLISH_EG0M2:
      case LanguageE.ENGLISH_EG0M3:
        return (
          <LatinLesson
            moduleIndex={lessonIndex}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            nextModule={nextModule}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
          />
        );
      case LanguageE.ENGLISH_G3M20:
        return (
          <English_G3M20
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      case LanguageE.ENGLISH_G6M26:
        return (
          <English_G6M26
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      case LanguageE.ENGLISH_G5M16:
        return (
          <English_G5M16
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
            answer={testTask?.question?.[lessonIndex].answers ?? []}
          />
        );
      case LanguageE.ENGLISH_EG4M23:
        return (
          <English_EG4M23
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      case LanguageE.ENGLISH_EG1M3:
        return (
          <EssayLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
          />
        );
      case LanguageE.ENGLISH_EG1M3:
        return (
          <VowelsLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );

      /**----------------------
       *todo    các question cho môn Tiếng trung
       *------------------------**/

      case LanguageE.MANDARIN_M0G1:
      case LanguageE.MANDARIN_M0G2:
      case LanguageE.MANDARIN_M0G3:
        return (
          <Mandarin_Kindergarten
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      case LanguageE.MANDARIN_G5M25:
        return (
          <Mandarin_G5M25
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      case LanguageE.MANDARIN_G6M31:
        return (
          <Mandarin_G6M31
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      case LanguageE.MANDARIN_G4M27:
        return (
          <Mandarin_G4M27
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      case LanguageE.MANDARIN_G3M37:
        return (
          <Mandarin_G3M37
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      case LanguageE.MANDARIN_G2M25:
        return (
          <Mandarin_G2M25
            moduleIndex={lessonIndex}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            nextModule={nextModule}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
          />
        );
      case LessonTypeE.WRITING:
      case LanguageE.MANDARIN_G1M4:
        return (
          <WriteLesson
            moduleIndex={lessonIndex}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            nextModule={nextModule}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
          />
        );
      case LanguageE.MANDARIN_G1M5:
        return (
          <Mandarin_G1M5
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      case LanguageE.MANDARIN_G1M6:
        return (
          <PronunciationLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
          />
        );
      /**----------------------
       *todo    các question cho môn khoa học
       *------------------------**/
      case LessonTypeE.MIX_COLOR:
        return (
          <ScienceLesson
            moduleIndex={lessonIndex}
            answers={(testTask?.question[lessonIndex]?.answers ?? []).map(
              v => '#' + v.replace('.png', ''),
            )}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            nextModule={nextModule}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
          />
        );
      case ScienceE.SCIENCE_G0M1:
        return (
          <Science_G0M1
            moduleIndex={lessonIndex}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            nextModule={nextModule}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
          />
        );
      case ScienceE.SCIENCE_G0M2:
        return (
          <ScienceLesson
            moduleIndex={lessonIndex}
            answers={(testTask?.question[lessonIndex]?.answers ?? []).map(
              v => '#' + v.replace('.png', ''),
            )}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            nextModule={nextModule}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
          />
        );
      /**----------------------
       *todo    các question cho môn toán
       *------------------------**/
      case MathQuestionType.MathMG0M1:
      case MathQuestionType.MathMG0M2:
      case MathQuestionType.MathMG0M3:
        return (
          <Math_Kindergarten
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
            isMulti={true}
            answer={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']}
          />
        );
      case MathQuestionType.MathMG2M4:
      case MathQuestionType.MathMG3M8:
        return (
          <Math_MG2M4
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
            isMulti={true}
            answer={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']}
          />
        );
      case MathQuestionType.MathMG5M18:
        return (
          <Math_MG5M18
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
            isMulti={true}
            answer={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']}
          />
        );
      case MathQuestionType.MathMG6M15:
        return (
          <Math_MG6M15
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            ref={vowelRef}
            isMulti={true}
            answer={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']}
          />
        );
      case MathQuestionType.MathMG4M30:
        return (
          <MathLesson
            moduleIndex={lessonIndex}
            nextModule={nextModule}
            totalModule={testTask?.question.length ?? 0}
            backgroundImage={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage
            }
            characterImageSuccess={
              env.IMAGE_BACKGROUND_BASE_API_URL +
              lessonSetting?.figureSuccessImage
            }
            characterImageFail={
              env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage
            }
            lessonName={route.lessonName}
            moduleName={route.moduleName}
            firstMiniTestTask={testTask}
            ref={vowelRef}
          />
        );
      default:
        return <OnBoardingScreen />;
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
