import {View, StyleSheet} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import WriteLesson from './LessonComponent/WriteLesson';
import MathLesson from './LessonComponent/MathLesson';
import {
  navigateScreen,
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
import English_G5M16 from './LessonComponent/English_G5M16';
import English_G6M26 from './LessonComponent/English_G6M26';
import English_CharSelector from './LessonComponent/English_CharSelector_Meaning';
import Mandarin_G1M5 from './LessonComponent/Mandarin_G1M5';
import Mandarin_G2M25 from './LessonComponent/Mandarin_G2M25';
import Mandarin_G3M37 from './LessonComponent/Mandarin_G3M37';
import Mandarin_G4M27 from './LessonComponent/Mandarin_G4M27';
import Mandarin_G5M25 from './LessonComponent/Mandarin_G5M25';
import Mandarin_G6M31 from './LessonComponent/Mandarin_G6M31';
import Mandarin_Kindergarten from './LessonComponent/Mandarin_Kindergarten';
import Math_MG6M15 from './LessonComponent/Math_MG6M15';
import Math_Kindergarten from './LessonComponent/Math_Kindergarten';
import Science_G0M1 from './LessonComponent/Science_G0M1';
import Science_SG1M2 from './LessonComponent/Science_SG1M2';
import Science_SG2M4 from './LessonComponent/Science_SG2M4';
import Science_SG4M3 from './LessonComponent/Science_SG4M3';
import Science_SG5M5 from './LessonComponent/Science_SG5M5';
import Science_SG3M9 from './LessonComponent/Science_SG3M9';
import VnG1M3Lesson from './LessonComponent/Vietnamese_VNG1M3_Lesson';
import VnG2M8Lesson from './LessonComponent/Vietnamese_G2M8_lesson';
import VnG0M2Lesson from './LessonComponent/Vietnamese_G0M2_lesson';
import VnG0M3Lesson from './LessonComponent/Vietnamese_G0M3_lesson';
import VnG0M1Lesson from './LessonComponent/Vietnamese_G0M1_Leson';
import VnG4M1Lesson from './LessonComponent/Vietnamese_G4M1_lesson';
import VnG5M1Lesson from './LessonComponent/Vietnamese_G5M1_lesson';
import Math_MG1M3 from './LessonComponent/Math_MG1M3';
import Math_MG1M3_P4 from './LessonComponent/Math_MG1M3_P4';
import Science_SG6M3 from './LessonComponent/Science_SG6M3';
import Math_MG4M16 from './LessonComponent/Math_MG4M16';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VnG4M3Lesson from './LessonComponent/Vietnamese_G4M3_lesson';
import DragProvider from '../components/Drag/DragProvider';
import VNG5M1NLesson from './LessonComponent/Vietnamese_G5M1_N_Leson';
import VnG1M1Lesson from './LessonComponent/Vietnamese_SelectAnswer';
import VnG1M4Lesson from './LessonComponent/Vietnamese_VNG1M4_Lesson';
import VnG1M5Lesson from './LessonComponent/Vietnamese_VNG1M5_Lesson';
import VnG1M7Lesson from './LessonComponent/Vietnamese_VNG1M7_Lesson';
import VnG1M8Lesson from './LessonComponent/Vietnamese_VNG1M8_Lesson';
import VnG1M9Lesson from './LessonComponent/Vietnamese_VNG1M9_Lesson';
import VnG1M10Lesson from './LessonComponent/Vietnamese_VNG1M10_Lesson';
import VnG1M2Lesson from './LessonComponent/Vietnamese_VNG1M2_Lesson';
import VnG1M6Lesson from './LessonComponent/Vietnamese_G1M6_lesson';
import VnG2M1Lesson from './LessonComponent/Vietnamese_VNG2M1_Lesson';
import VnG2M12Lesson from './LessonComponent/Vietnamese_G2M12_lesson';
import VnG3M1Lesson from './LessonComponent/Vietnamese_G3M1_lesson';
import VnG3M2Lesson from './LessonComponent/Vietnamese_G3M2_lesson';
import VnG3M3Lesson from './LessonComponent/Vietnamese_G3M3_lesson';
import VnG3M4Lesson from './LessonComponent/Vietnamese_G3M4_lesson';
import VnG3M5Lesson from './LessonComponent/Vietnamese_G3M5_lesson';
import VnG3M6Lesson from './LessonComponent/Vietnamese_G3M6_lesson';
import VnG3M7Lesson from './LessonComponent/Vietnamese_G3M7_lesson';
import VnG3M8Lesson from './LessonComponent/Vietnamese_G3M8_lesson';
import VnG3M10Lesson from './LessonComponent/Vietnamese_G3M10_lesson';
import Mandarin_G4M_DrawCharacter from './LessonComponent/Mandarin_G4M_DrawCharacter';
import Mandarin_G4M_SelectAnswer from './LessonComponent/Mandarin_G4M_SelectAnswer';
import Mandarin_G4_Pronunciation from './LessonComponent/Mandarin_G4_Pronunciation';
import Math_MG3_KeyboardNumber from './LessonComponent/Math_MG3_KeyboardNumber';
import Math_G3M_SelectAnswer from './LessonComponent/Math_G3M_SelectAnswer';
import Math_G4M_SelectAnswer from './LessonComponent/Math_G4M_SelectAnswer';
import Math_MG2M11 from './LessonComponent/Math_MG2M11';
import LatinLesson from './LessonComponent/LatinLesson';
import English_Pronounciation from './LessonComponent/English_Pronounciation';
import English_SelectAnswer from './LessonComponent/English_SelectAnswer';
import English_DrawerCharacter from './LessonComponent/English_DrawerCharacter';
import English_SelectText from './LessonComponent/English_SelectText';
import English_QwertyKeyboard from './LessonComponent/English_QwertyKeyboard';
import English_CharSelector_Meaning from './LessonComponent/English_CharSelector_Meaning';
import English_Pronounciation_Meaning from './LessonComponent/English_Pronounciation_Meaning';
import English_CombineSentences from './LessonComponent/English_CombineSentences';

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

const props = (
  dataProps: any,
  testTask: any,
  lessonIndex: number,
  characterStyle: any,
) => ({
  ...dataProps,
  characterStyle,
});
// Lesson component mapping with regex patterns
const LESSON_PATTERNS = [
  // English Lessons
  {
    pattern: /^pronunciation$/,
    component: PronunciationLesson,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG0M[1-3]$/,
    component: LatinLesson,
    props: {},
  },
  {
    pattern: /^ENGLISH_G6M26$/,
    component: English_G6M26,
    props: {},
  },
  {
    pattern: /^ENGLISH_G5M16$/,
    component: English_G5M16,
    props: {},
  },
  {
    pattern: /^ENGLISH_G4M23$/,
    component: English_EG4M23,
    props: {},
  },
  // * English G1
  {
    pattern: /^ENGLISH_EG1M[1-8]$/,
    component: EssayLesson,
    props,
  },
  {
    pattern: /^ENGLISH_EG1M(9|10|11|12|13|14|15|16|17)$/,
    component: English_EG4M23,
    props,
  },
  // * English G2
  //: TODO: tồn động : M35, 33
  {
    pattern: /^ENGLISH_EG2M(1|3|5|7|9|16)$/,
    component: VowelsLesson,
    props,
  },
  {
    pattern: /^ENGLISH_EG2M(2|4|6|8|10|13|14|15|17)$/,
    component: English_Pronounciation,
    props,
  },
  {
    pattern: /^ENGLISH_EG2M(11)$/,
    component: English_DrawerCharacter,
    props,
  },
  {
    pattern: /^ENGLISH_EG2M(12)$/,
    component: MultiPronunciationLesson,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG2M(20|30|33|35|41)$/,
    component: English_CombineSentences,
    props,
  },
  {
    pattern:
      /^(ENGLISH_EG2M(23|24|25|26|27|28|29|31|32|34|36|37|38|39|40|42|43|44|45|46|47|48|49|51|52|53|54))$/,
    component: English_SelectAnswer,
    props,
  },
  {
    pattern: /^(ENGLISH_EG2M(41)|ENGLISH_EG3M(26|30|39))$/,
    component: English_QwertyKeyboard,
    props,
  },
  {
    pattern: /^ENGLISH_EG(2M(50)|3M(40|41))$/,
    component: English_SelectText,
    props,
  },
  // * English G3
  {
    pattern: /^ENGLISH_G3M20$/,
    component: English_CharSelector,
    props,
  },
  {
    pattern: /^ENGLISH_EG3M(1|3|5|7|9|26|28|30)$/,
    component: English_CharSelector,
    props,
  },
  {
    pattern: /^ENGLISH_EG3M(2|4|6|8|10)$/,
    component: English_Pronounciation,
    props,
  },
  {
    pattern:
      /^ENGLISH_EG3M(21|22|23|24|27|29|31|32|33|34|35|36|37|38|39|42|43|44|45|46)$/,
    component: English_SelectAnswer,
    props,
  },
  {
    pattern: /^ENGLISH_EG3M(25|40|41)$/,
    component: English_SelectText,
    props,
  },
  // * English G4
  {
    pattern: /^ENGLISH_EG4M(1|3|5|7|9)$/,
    component: English_CharSelector_Meaning,
    props,
  },
  {
    pattern: /^ENGLISH_EG4M(2|4|6|8|10)$/,
    component: English_Pronounciation_Meaning,
    props,
  },
  {
    pattern: /^ENGLISH_EG4M(11|12|13|14|20|23|24|27|28|29|30|31|33|34)$/,
    component: English_SelectAnswer,
    props,
  },
  {
    pattern: /^ENGLISH_EG4M(15|16|17|18|19|21|22|25|26|32)$/,
    component: English_SelectText,
    props,
  },
  // * English G5
  {
    pattern: /^ENGLISH_EG5M(1|3|5|7|9)$/,
    component: English_CharSelector_Meaning,
    props,
  },
  {
    pattern: /^ENGLISH_EG5M(2|4|6|8|10)$/,
    component: English_Pronounciation_Meaning,
    props,
  },
  {
    pattern: /^ENGLISH_EG5M(11)$/,
    component: English_QwertyKeyboard,
    props,
  },
  {
    pattern: /^ENGLISH_EG5M(12|17|19|20|22|24|25|26|27|28|29|30|31|32|33|34)$/,
    component: English_SelectAnswer,
    props,
  },
  {
    pattern: /^ENGLISH_EG5M(13|14|15|18|21|23)$/,
    component: English_SelectText,
    props,
  },
  // * English G6
  {
    pattern: /^ENGLISH_EG6M(1|3|5|7|9)$/,
    component: English_CharSelector_Meaning,
    props,
  },
  {
    pattern: /^ENGLISH_EG6M(2|4|6|8|10)$/,
    component: English_Pronounciation_Meaning,
    props,
  },
  {
    pattern: /^ENGLISH_EG6M(11|15|16|17|18)$/,
    component: English_QwertyKeyboard,
    props,
  },
  {
    pattern: /^ENGLISH_EG6M(12|13|14|20|21|22|23|24)$/,
    component: English_SelectAnswer,
    props,
  },
  // Mandarin Lessons
  {
    pattern: /^MANDARIN_MDG0M[1-3]$/,
    component: Mandarin_Kindergarten,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG5M25$/,
    component: Mandarin_G5M25,
    props: {},
  },
  {
    pattern: /^(writing|MANDARIN_MDG[1-6]M(1|7|10|13))$/,
    component: Mandarin_G4M_DrawCharacter,
    props,
  },
  {
    pattern: /^MANDARIN_MDG[1-6]M(2|5|8|11|14)$/,
    component: Mandarin_G4M_SelectAnswer,
    props,
  },
  {
    pattern: /^MANDARIN_MDG[1-6]M(3|6|9|12|15)$/,
    component: Mandarin_G4_Pronunciation,
    props,
  },
  {
    pattern: /^MANDARIN_MDG1M4$/,
    component: WriteLesson,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG[2-6]M4$/,
    component: Mandarin_G4M_DrawCharacter,
    props,
  },
  {
    pattern: /^MANDARIN_MDG1M5$/,
    component: Mandarin_G1M5,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG1M6$/,
    component: PronunciationLesson,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG2M25$/,
    component: Mandarin_G2M25,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG3M37$/,
    component: Mandarin_G3M37,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG4M27$/,
    component: Mandarin_G4M27,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG6M31$/,
    component: Mandarin_G6M31,
    props: {},
  },

  // Vietnamese Lessons
  {
    pattern: /^VIETNAMESE_VNG(0M1|2M2|3M9|4M2)$/,
    component: VnG0M1Lesson,
    props,
  },
  {
    pattern: /^VIETNAMESE_VNG0M2$/,
    component: VnG0M2Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG0M3$/,
    component: VnG0M3Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG1M([1-9]|10)$/,
    component: (type: string) => {
      const componentMap: Record<string, any> = {
        VIETNAMESE_VNG1M1: VnG1M1Lesson,
        VIETNAMESE_VNG1M2: VnG1M2Lesson,
        VIETNAMESE_VNG1M3: VnG1M3Lesson,
        VIETNAMESE_VNG1M4: VnG1M4Lesson,
        VIETNAMESE_VNG1M5: VnG1M5Lesson,
        VIETNAMESE_VNG1M6: VnG1M6Lesson,
        VIETNAMESE_VNG1M7: VnG1M7Lesson,
        VIETNAMESE_VNG1M8: VnG1M8Lesson,
        VIETNAMESE_VNG1M9: VnG1M9Lesson,
        VIETNAMESE_VNG1M10: VnG1M10Lesson,
      };
      return componentMap[type] || VnG0M1Lesson;
    },
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG3M(1|2|3|4|5|6|7|8|10)$/,
    component: (type: string) => {
      const componentMap: Record<string, any> = {
        VIETNAMESE_VNG3M1: VnG3M1Lesson,
        VIETNAMESE_VNG3M2: VnG3M2Lesson,
        VIETNAMESE_VNG3M3: VnG3M3Lesson,
        VIETNAMESE_VNG3M4: VnG3M4Lesson,
        VIETNAMESE_VNG3M5: VnG3M5Lesson,
        VIETNAMESE_VNG3M6: VnG3M6Lesson,
        VIETNAMESE_VNG3M7: VnG3M7Lesson,
        VIETNAMESE_VNG3M8: VnG3M8Lesson,
        VIETNAMESE_VNG3M10: VnG3M10Lesson,
      };
      return componentMap[type] || VnG0M1Lesson;
    },
    props,
  },
  {
    pattern: /^VIETNAMESE_VNG2M1$/,
    component: VnG2M1Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG2M(3|4|5|6|8|9|10)$/,
    component: VnG2M8Lesson,
    props,
  },
  {
    pattern: /^VIETNAMESE_VNG2M(7|8)$/,
    component: VnG1M7Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG2M(11|12)$/,
    component: VnG2M12Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG4M3$/,
    component: VnG4M3Lesson,
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG4M1$/,
    component: VnG4M1Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG4M(4|5|6|7|8|9|10)$/,
    component: VnG2M8Lesson,
    props,
  },
  {
    pattern: /^VIETNAMESE_VNG5M1$/,
    component: VnG5M1Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG5M(1_N|2)$/,
    component: VNG5M1NLesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG5M(3|4|5|6|7|8|9|10|11|12)$/,
    component: VnG2M8Lesson,
    props,
  },
  {
    pattern: /^VIETNAMESE_VNG6M1$/,
    component: VnG3M1Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG6M(1_N|2|3|4|5|6|7|8|9|10)$/,
    component: VnG2M8Lesson,
    props,
  },

  // Science Lessons
  {
    pattern: /^mix_color$/,
    component: ScienceLesson,
    props: (dataProps: any, testTask: any, lessonIndex: number) => ({
      ...dataProps,
      answers: (
        (testTask?.question[lessonIndex]?.answers as string[]) ?? []
      ).map((v: string) => '#' + v.replace('.png', '')),
    }),
  },
  {
    pattern: /^SCIENCE_SG0M1$/,
    component: Science_G0M1,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG0M2$/,
    component: ScienceLesson,
    props: (dataProps: any, testTask: any, lessonIndex: number) => ({
      ...dataProps,
      answers: (
        (testTask?.question[lessonIndex]?.answers as string[]) ?? []
      ).map((v: string) => '#' + v.replace('.png', '')),
    }),
  },
  {
    pattern: /^SCIENCE_SG[1-6]M\d+$/,
    component: (type: string) => {
      const componentMap: Record<string, any> = {
        SCIENCE_SG1M2: Science_SG1M2,
        SCIENCE_SG2M4: Science_SG2M4,
        SCIENCE_SG3M9: Science_SG3M9,
        SCIENCE_SG4M3: Science_SG4M3,
        SCIENCE_SG5M5: Science_SG5M5,
        SCIENCE_SG6M6: Science_SG6M3,
      };
      return componentMap[type] || Science_G0M1;
    },
    props: {},
  },

  // Math Lessons
  {
    pattern: /^MATH_MG0M[1-3]$/,
    component: Math_Kindergarten,
    props: {
      isMulti: true,
      answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
  },
  {
    pattern: /^MATH_MG1M(1|2|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18)$/,
    component: Math_G4M_SelectAnswer,
    props,
  },
  {
    pattern: /^MATH_MG1M3$/,
    component: (dataProps: any, testTask: any) =>
      testTask?.stt === 4 ? Math_MG1M3_P4 : Math_MG1M3,
    props: (dataProps: any, testTask: any, lessonIndex: number) =>
      testTask?.stt === 4
        ? {
            ...dataProps,
            isMulti: true,
            answer: testTask.question[lessonIndex].answers as string[],
          }
        : {
            ...dataProps,
            isMulti: false,
            answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
          },
  },
  {
    pattern: /^MATH_MG2M(1|3|4|5|6|9|10|12|16)$/,
    component: Math_G3M_SelectAnswer,
    props: {},
  },
  {
    pattern: /^MATH_MG2M(2|7)$/,
    component: Math_MG2M4,
    props: {isMulti: false},
  },
  {
    pattern: /^MATH_MG2M(8|13|14)$/,
    component: Math_G4M_SelectAnswer,
    props: (
      dataProps: any,
      testTask: any,
      lessonIndex: number,
      characterStyle: any,
    ) => ({
      ...dataProps,
      characterStyle,
    }),
  },
  {
    pattern: /^MATH_MG2M11$/,
    component: Math_MG2M11,
    props: {},
  },
  {
    pattern: /^MATH_MG2M(4|15|16|19|20)$/,
    component: Math_MG2M4,
    props: {
      isMulti: true,
      answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
  },
  {
    pattern: /^MATH_MG3M(6|7|8|10|11|13|14|15|23|24|25|26|27)$/,
    component: Math_MG3_KeyboardNumber,
    props: {
      isMulti: true,
      answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
  },
  {
    pattern: /^MATH_MG3M(5|16|18|21|22)$/,
    component: Math_G4M_SelectAnswer,
    props: (
      dataProps: any,
      testTask: any,
      lessonIndex: number,
      characterStyle: any,
    ) => ({
      ...dataProps,
      characterStyle,
    }),
  },
  {
    pattern: /^MATH_MG4M(13|14|15|23|24|25|26|27)$/,
    component: Math_MG3_KeyboardNumber,
    props: (
      dataProps: any,
      testTask: any,
      lessonIndex: number,
      characterStyle: any,
    ) => ({
      ...dataProps,
      isMulti: true,
      answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      characterStyle,
    }),
  },
  {
    pattern: /^MATH_MG4M(18|21|22)$/,
    component: Math_G4M_SelectAnswer,
    props: (
      dataProps: any,
      testTask: any,
      lessonIndex: number,
      characterStyle: any,
    ) => ({
      ...dataProps,
      characterStyle,
    }),
  },
  {
    pattern: /^MATH_MG4M16$/,
    component: Math_MG4M16,
    props: {
      isMulti: true,
      answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
  },
  {
    pattern: /^MATH_MG4M30$/,
    component: MathLesson,
    props: {},
  },
  {
    pattern: /^MATH_MG5M(8|12|13|14|15|16|18)$/,
    component: Math_MG3_KeyboardNumber,
    props: (
      dataProps: any,
      testTask: any,
      lessonIndex: number,
      characterStyle: any,
    ) => ({
      ...dataProps,
      isMulti: true,
      answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      characterStyle,
    }),
  },
  {
    pattern: /^MATH_MG5M(9|10|11)$/,
    component: Math_G4M_SelectAnswer,
    props: (
      dataProps: any,
      testTask: any,
      lessonIndex: number,
      characterStyle: any,
    ) => ({
      ...dataProps,
      characterStyle,
    }),
  },
  {
    pattern: /^MATH_MG6M15$/,
    component: Math_MG6M15,
    props: {
      isMulti: true,
      answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
  },
  {
    pattern: /^MATH_MG6M(1|2|3|4|6|7|9|10|11|12|13|14)$/,
    component: Math_G4M_SelectAnswer,
    props,
  },
  {
    pattern: /^MATH_MG6M(8)$/,
    component: Math_MG3_KeyboardNumber,
    props: (
      dataProps: any,
      testTask: any,
      lessonIndex: number,
      characterStyle: any,
    ) => ({
      ...dataProps,
      isMulti: true,
      answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      characterStyle,
    }),
  },
];

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
  const env = coreModuleContainer.getProvided<Env>(EnvToken);

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

  const {lessonSetting, characterStyle} = useHomeStore();
  const i18n = useI18n();
  const {tasks: apiTasks} = useListQuestions(route?.lessonId);

  const tasks = useMemo(() => {
    return __DEV__
      ? apiTasks.map(t => ({
          ...t,
          question: __DEV__ ? t.question.slice(0, 10) : t.question,
        }))
      : apiTasks.map(t => ({
          ...t,
          question: t.question,
        }));
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

  const firstMiniTestTask = tasks.find(task => task.type === 'mini_test');

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
                env.IMAGE_BACKGROUND_BASE_API_URL +
                lessonSetting?.figureSuccessImage,
              backgroundAndie:
                env.IMAGE_BACKGROUND_BASE_API_URL +
                lessonSetting?.backgroundImage,
              colorBgBookView: settings.backgroundButtonColor,
              title: i18n.t('lesson.screens.Modules.youDidGreat'),
              note: i18n.t('lesson.screens.Modules.goodjobMinitest'),
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
      i18n,
      lessonIndex,
      lessonSetting?.backgroundImage,
      lessonSetting?.figureSuccessImage,
      lessonState.result,
      playSound,
      route.lessonName,
      route.moduleName,
      settings.backgroundButtonColor,
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
              colorBgBookView: settings.backgroundButtonColor,
              title: i18n.t('lesson.screens.Modules.youDidGreat'),
              note: i18n.t('lesson.screens.Modules.goodJobTraining'),
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
          title = i18n.t('lesson.screens.Modules.amazing'); // * title của câu cảm xúc ở màn done screen
          note = i18n.t('lesson.screens.Modules.youDoingGreat'); // * câu note ở dưới
        } else if (trainingCount === 2) {
          // * nếu làm xong lần 2
          title = i18n.t('lesson.screens.Modules.excellent');
          note = i18n.t('lesson.screens.Modules.youCanDoIt');
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
            colorBgBookView: settings.backgroundButtonColor,
            title,
            countTime: `${trainingCount - 1} ${i18n.t(
              'lesson.screens.Modules.moreTime',
            )}`,
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
      settings.backgroundButtonColor,
      i18n,
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
      pauseSound(() => {
        console.log('Attempting to play big bell sound');
        playSound(soundTrack.big_bell_sound);
      });
    };

    enterMiniTest();

    return () => {
      console.log('Cleanup: attempting to pause current sound');
      pauseSound(() => {
        loopSound(soundTrack.ukulele_music); // * lặp lại bài background
      }); // * pausse tất cả các sound khi làm bài
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

  const dataProps = {
    moduleIndex: lessonIndex,
    nextModule,
    totalModule: testTask?.question.length ?? 0,
    lessonName: route.lessonName,
    moduleName: route.moduleName,
    firstMiniTestTask: testTask,
    backgroundImage:
      env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.backgroundImage,
    characterImageSuccess:
      env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureSuccessImage,
    characterImageFail:
      env.IMAGE_BACKGROUND_BASE_API_URL + lessonSetting?.figureFailImage,
    answer: testTask?.question?.[lessonIndex].answers as string[],
  };

  const buildLesson = () => {
    const questionType = testTask?.question?.[lessonIndex]?.type.trim();

    if (!questionType) {
      return <OnBoardingScreen />;
    }
    // Find matching pattern
    const matchedPattern = LESSON_PATTERNS.find(pattern => {
      console.log(
        '🛠 LOG: 🚀 --> ~ file: LessonScreen.tsx:1046 ~ LessonScreen ~ matchedPattern:',
        pattern,
      );
      return pattern.pattern.test(questionType);
    });

    if (!matchedPattern) {
      return <OnBoardingScreen />;
    }

    // Get component
    let Component = matchedPattern.component;
    if (typeof Component === 'function' && Component.length > 0) {
      Component = Component(questionType, dataProps);
    }

    // Get props
    let props = matchedPattern.props;
    if (typeof props === 'function') {
      props = props(dataProps, testTask, lessonIndex, characterStyle);
    } else {
      props = {...dataProps, ...props};
    }

    // Handle wrapper if exists
    if (matchedPattern.wrapper) {
      const Wrapper = matchedPattern.wrapper;
      return (
        <Wrapper>
          <Component {...props} ref={vowelRef} />
        </Wrapper>
      );
    }

    return <Component {...props} ref={vowelRef} />;
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
