import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useMemo,
} from 'react';
import {SelectionAnswersQuestionRef} from '../SelectionAnswersQuestion';
import {ModuleDetailProps} from '.';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';

// Define the context shape
interface ModuleDetailContextType
  extends ReturnType<typeof useSelectionAnswers>,
    ModuleDetailProps {}

// Create the context with default values
const ModuleDetailContext = createContext<ModuleDetailContextType | undefined>(
  undefined,
);

// Props for the provider
interface ModuleDetailProviderProps extends ModuleDetailProps {
  children: ReactNode;
}

// Hook for handling selection answers
interface UseSelectionAnswersProps {
  firstMiniTestTask?: any;
  moduleIndex?: number;
  nextModule?: (answerSelected: string) => void;
  answerRef?: React.RefObject<any>;
  answerSelected?: string;
  getCorrectAnswer?: (answer: string) => string;
}

export const useSelectionAnswers = (props: UseSelectionAnswersProps = {}) => {
  const {trainingCount, getSetting} = useLessonStore();
  const {
    firstMiniTestTask,
    moduleIndex = 0,
    nextModule = () => {},
    answerRef,
    answerSelected = '',
    getCorrectAnswer = (answer: string) => answer,
  } = props;

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const selectionRef = useRef<SelectionAnswersQuestionRef>(null);

  const {
    isAnswerCorrect,
    isShowCorrectContainer,
    word,
    learningTimer,
    submit,
    toggleShowHint,
    resetLearning,
  } = useSettingLesson({
    countDownTime: trainingCount <= 2 ? 0 : 5,
    isCorrectAnswer:
      answerSelected ===
      getCorrectAnswer(
        firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer
          .toString()
          .toLowerCase(),
      ),
    onSubmit: () => {
      setSelectedAnswers([]);
      nextModule(answerSelected);
      answerRef?.current?.resetAnswerSelected?.();
    },
    fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
  });
  const partName = useMemo(() => {
    return firstMiniTestTask?.name ?? '';
  }, [firstMiniTestTask]);

  const handleSelectAnswer = (selected: string[]) => {
    setSelectedAnswers(selected);
  };

  const handleSubmit = () => {
    // This is an example logic - you should replace with your actual logic
    const correctAnswer =
      firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer?.toString() ||
      'DÒNG SÔNG NHỮNG CON SÓNG NHỎ';
    const isCorrect = selectedAnswers.includes(correctAnswer);
  };

  return {
    selectedAnswers,
    isShowCorrectContainer,
    isAnswerCorrect,
    learningTimer,
    partName,
    word,
    handleSelectAnswer,
    handleSubmit,
    selectionRef,
    resetLearning,
    toggleShowHint,
  };
};

// Create the provider component
export const ModuleDetailProvider = ({
  children,
  ...props
}: ModuleDetailProviderProps) => {
  const values = useSelectionAnswers({
    firstMiniTestTask: props.firstMiniTestTask,
    moduleIndex: props.moduleIndex,
    nextModule: props.nextModule,
  });

  // Provide the context value

  return (
    <ModuleDetailContext.Provider value={{...values, ...props}}>
      {children}
    </ModuleDetailContext.Provider>
  );
};

// Custom hook to use the context
export const useModuleDetail = (): ModuleDetailContextType => {
  const context = useContext(ModuleDetailContext);
  if (context === undefined) {
    throw new Error(
      'useModuleDetail must be used within a ModuleDetailProvider',
    );
  }
  return context;
};
