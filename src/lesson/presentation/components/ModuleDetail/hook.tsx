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

// Define the context shape
interface ModuleDetailContextType extends ModuleDetailProps {
  selectedAnswers: string[];
  isShowCorrectContainer: boolean;
  isAnswerCorrect: boolean;
  learningTimer: number;
  answerOptions: string[];
  partName: string;
  handleSelectAnswer: (selected: string[]) => void;
  handleSubmit: () => void;
  selectionRef: React.RefObject<SelectionAnswersQuestionRef>;
  setLearningTimer: (e: number) => void;
  setIsAnswerCorrect: (e: boolean) => void;
  setIsShowCorrectContainer: (e: boolean) => void;
}

// Create the context with default values
const ModuleDetailContext = createContext<ModuleDetailContextType | undefined>(
  undefined,
);

// Props for the provider
interface ModuleDetailProviderProps extends ModuleDetailProps {
  children: ReactNode;
}

// Create the provider component
export const ModuleDetailProvider = ({
  children,
  ...props
}: ModuleDetailProviderProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isShowCorrectContainer, setIsShowCorrectContainer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [learningTimer, setLearningTimer] = useState(0);
  const selectionRef = useRef<SelectionAnswersQuestionRef>(null);
  const partName = useMemo(() => {
    return props.firstMiniTestTask?.name ?? '';
  }, [props.firstMiniTestTask]);

  const answerOptions = [
    'DƯỚI ÁNH TRĂNG',
    'DÒNG SÔNG NHỮNG CON SÓNG NHỎ',
    'SÁNG RỰC LÊN',
    'VỖ NHẸ VÀO HAI BỜ CÁT.',
  ];

  const handleSelectAnswer = (selected: string[]) => {
    setSelectedAnswers(selected);
  };

  const handleSubmit = () => {
    // Check if answer is correct (example logic)
    const correctAnswer = 'DÒNG SÔNG NHỮNG CON SÓNG NHỎ';
    const isCorrect = selectedAnswers.includes(correctAnswer);

    setIsAnswerCorrect(isCorrect);
    setIsShowCorrectContainer(true);
  };

  // Provide the context value
  const value = {
    selectedAnswers,
    isShowCorrectContainer,
    isAnswerCorrect,
    learningTimer,
    answerOptions,
    partName,
    handleSelectAnswer,
    handleSubmit,
    selectionRef,
    setLearningTimer,
    setIsAnswerCorrect,
    setIsShowCorrectContainer,
  };

  return (
    <ModuleDetailContext.Provider value={{...value, ...props}}>
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
