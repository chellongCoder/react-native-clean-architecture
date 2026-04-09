import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
} from 'react';
// Lazy loaded lesson components for code splitting
const MathLesson = lazy(() => import('./LessonComponent/MathLesson'));
const VowelsLesson = lazy(() => import('./LessonComponent/VowelsLesson'));
const EssayLesson = lazy(() => import('./LessonComponent/EssayLesson'));
const PronunciationLesson = lazy(
  () => import('./LessonComponent/PronunciationLesson'),
);
const MultiPronunciationLesson = lazy(
  () => import('./LessonComponent/MultiPronunciationLesson'),
);
const OnBoardingScreen = lazy(
  () => import('src/core/presentation/screens/OnBoardingScreen'),
);
const Math_MG2M4 = lazy(() => import('./LessonComponent/Math_MG2M4'));
const English_EG4M23 = lazy(() => import('./LessonComponent/English_EG4M23'));
const English_G5M16 = lazy(() => import('./LessonComponent/English_G5M16'));
const English_G6M26 = lazy(() => import('./LessonComponent/English_G6M26'));
const English_CharSelector = lazy(
  () => import('./LessonComponent/English_CharSelector_Meaning'),
);
const Mandarin_G2M25 = lazy(() => import('./LessonComponent/Mandarin_G2M25'));
const Mandarin_G3M37 = lazy(() => import('./LessonComponent/Mandarin_G3M37'));
const Mandarin_G4M27 = lazy(() => import('./LessonComponent/Mandarin_G4M27'));
const Mandarin_G5M25 = lazy(() => import('./LessonComponent/Mandarin_G5M25'));
const Mandarin_G6M31 = lazy(() => import('./LessonComponent/Mandarin_G6M31'));
const Mandarin_Kindergarten = lazy(
  () => import('./LessonComponent/Mandarin_Kindergarten'),
);
const Math_MG6M15 = lazy(() => import('./LessonComponent/Math_MG6M15'));
const Math_Kindergarten = lazy(
  () => import('./LessonComponent/Math_Kindergarten'),
);
const ScienceLesson = lazy(
  () => import('./LessonComponent/Science/ScienceLesson'),
);
const Science_G0M1 = lazy(
  () => import('./LessonComponent/Science/Science_G0M1'),
);
const Science_SG2M4 = lazy(
  () => import('./LessonComponent/Science/Science_SG2M4'),
);
const Science_SG4M3 = lazy(
  () => import('./LessonComponent/Science/Science_SG4M3'),
);
const Science_SG5M5 = lazy(
  () => import('./LessonComponent/Science/Science_SG5M5'),
);
const Science_SG3M9 = lazy(
  () => import('./LessonComponent/Science/Science_SG3M9'),
);
const VnG1M3Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_VNG1M3_Lesson'),
);
const VnG2M8Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G2M8_lesson'),
);
const VnG0M2Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G0M2_lesson'),
);
const VnG0M3Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G0M3_lesson'),
);
const VnG0M1Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G0M1_Leson'),
);
const VnG4M1Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G4M1_lesson'),
);
const VnG5M1Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G5M1_lesson'),
);
const Math_MG1M3_P4 = lazy(() => import('./LessonComponent/Math_MG1M3_P4'));
const Science_SG6M3 = lazy(
  () => import('./LessonComponent/Science/Science_SG6M3'),
);
const Math_MG4M16 = lazy(() => import('./LessonComponent/Math_MG4M16'));
const VnG4M3Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G4M3_lesson'),
);
const VNG5M1NLesson = lazy(
  () => import('./LessonComponent/Vietnamese_G5M1_N_Leson'),
);
const VnG1M1Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_SelectAnswer'),
);
const VnG1M4Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_VNG1M4_Lesson'),
);
const VnG1M5Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_VNG1M5_Lesson'),
);
const VnG1M7Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_VNG1M7_Lesson'),
);
const VnG1M8Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_VNG1M8_Lesson'),
);
const VnG1M9Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_VNG1M9_Lesson'),
);
const VnG1M10Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_VNG1M10_Lesson'),
);
const VnG1M2Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_VNG1M2_Lesson'),
);
const VnG1M6Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G1M6_lesson'),
);
const VnG2M1Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_VNG2M1_Lesson'),
);
const VnG2M12Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G2M12_lesson'),
);
const VnG3M1Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G3M1_lesson'),
);
const VnG3M2Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G3M2_lesson'),
);
const VnG3M3Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G3M3_lesson'),
);
const VnG3M4Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G3M4_lesson'),
);
const VnG3M5Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G3M5_lesson'),
);
const VnG3M6Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G3M6_lesson'),
);
const VnG3M7Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G3M7_lesson'),
);
const VnG3M8Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G3M8_lesson'),
);
const VnG3M10Lesson = lazy(
  () => import('./LessonComponent/Vietnamese_G3M10_lesson'),
);
const Mandarin_G4M_DrawCharacter = lazy(
  () => import('./LessonComponent/Mandarin_G4M_DrawCharacter'),
);
const Mandarin_G4M_SelectAnswer = lazy(
  () => import('./LessonComponent/Mandarin_G4M_SelectAnswer'),
);
const Mandarin_G4_Pronunciation = lazy(
  () => import('./LessonComponent/Mandarin_G4_Pronunciation'),
);
const Math_MG3_KeyboardNumber = lazy(
  () => import('./LessonComponent/Math_MG3_KeyboardNumber'),
);
const Math_G3M_SelectAnswer = lazy(
  () => import('./LessonComponent/Math_G3M_SelectAnswer'),
);
const Math_G4M_SelectAnswer = lazy(
  () => import('./LessonComponent/Math_G4M_SelectAnswer'),
);
const Math_MG2M11 = lazy(() => import('./LessonComponent/Math_MG2M11'));
const LatinLesson = lazy(() => import('./LessonComponent/LatinLesson'));
const English_Pronounciation = lazy(
  () => import('./LessonComponent/English_Pronounciation'),
);
const English_SelectAnswer = lazy(
  () => import('./LessonComponent/English_SelectAnswer'),
);
const English_DrawerCharacter = lazy(
  () => import('./LessonComponent/English_DrawerCharacter'),
);
const English_SelectText = lazy(
  () => import('./LessonComponent/English_SelectText'),
);
const English_QwertyKeyboard = lazy(
  () => import('./LessonComponent/English_QwertyKeyboard'),
);
const English_CharSelector_Meaning = lazy(
  () => import('./LessonComponent/English_CharSelector_Meaning'),
);
const English_Pronounciation_Meaning = lazy(
  () => import('./LessonComponent/English_Pronounciation_Meaning'),
);
const English_CombineSentences = lazy(
  () => import('./LessonComponent/English_CombineSentences'),
);
const English_PronounciationRepeat = lazy(
  () => import('./LessonComponent/English_PronounciationRepeat'),
);
const Math_Text_SelectAnswer = lazy(
  () => import('./LessonComponent/Math_Text_SelectAnswer'),
);
const English_SelectAnswer_Paragraph = lazy(
  () => import('./LessonComponent/English_SelectAnswer_Paragraph'),
);
const English_QwertyKeyboard_Paragraph = lazy(
  () => import('./LessonComponent/English_QwertyKeyboard_Paragraph'),
);
const Science_SG1M2 = lazy(
  () => import('./LessonComponent/Science/Science_SG1M2'),
);
const Science_SelectAnswer = lazy(
  () => import('./LessonComponent/Science/Science_SelectAnswer'),
);
const Science_SelectAnswer_Image_TextImageAnswer = lazy(
  () =>
    import(
      './LessonComponent/Science/Science_SelectAnswer_Image_TextImageAnswer'
    ),
);
const Science_SelectAnswer_2Question = lazy(
  () => import('./LessonComponent/Science/Science_SelectAnswer_2Question'),
);
const Science_SelectAnswer_Circle = lazy(
  () => import('./LessonComponent/Science/Science_SelectAnswer_Circle'),
);
const Science_G4M2 = lazy(
  () => import('./LessonComponent/Science/Science_G4M2'),
);
const Science_G4M5 = lazy(
  () => import('./LessonComponent/Science/Science_G4M5'),
);
const Science_G4M4 = lazy(
  () => import('./LessonComponent/Science/Science_G4M4'),
);
const Science_SelectAnswer_ImageLearning = lazy(
  () => import('./LessonComponent/Science/Science_SelectAnswer_ImageLearning'),
);
const Science_SelectAnswer_Image_TextUnderline = lazy(
  () =>
    import(
      './LessonComponent/Science/Science_SelectAnswer_Image_TextUnderline'
    ),
);
const Science_SelectAnswer_ParagraphImage = lazy(
  () => import('./LessonComponent/Science/Science_SelectAnswer_ParagraphImage'),
);
const Science_SelectAnswer_Image_Text = lazy(
  () => import('./LessonComponent/Science/Science_SelectAnswer_Image_Text'),
);
const Science_SelectAnswer_ImageMeaning_Image = lazy(
  () =>
    import('./LessonComponent/Science/Science_SelectAnswer_ImageMeaning_Image'),
);
const Science_SelectAnswer_ScrollQuestion = lazy(
  () => import('./LessonComponent/Science/Science_SelectAnswer_ScrollQuestion'),
);
const Science_SG5M2 = lazy(
  () => import('./LessonComponent/Science/Science_SG5M2'),
);
const Science_SG2M8 = lazy(
  () => import('./LessonComponent/Science/Science_SG2M8'),
);
const Science_SelectAnswer_AnswerMeaning = lazy(
  () => import('./LessonComponent/Science/Science_SelectAnswer_AnswerMeaning'),
);
const Science_SelectAnswer_Explain_TextImageAnswer = lazy(
  () =>
    import(
      './LessonComponent/Science/Science_SelectAnswer_Explain_TextImageAnswer'
    ),
);
const Science_G5M1 = lazy(
  () => import('./LessonComponent/Science/Science_G5M1'),
);
const Science_SelectAnswer_AnswerImage_MultipleQuestion = lazy(
  () =>
    import(
      './LessonComponent/Science/Science_SelectAnswer_AnswerImage_MultipleQuestion'
    ),
);
const History_Finding_Diff_Point = lazy(
  () => import('./LessonComponent/History/History_Finding_Diff_Point'),
);
const History_SelectAnswer_SwipeImage = lazy(
  () => import('./LessonComponent/History/History_SelectAnswer_SwipeImage'),
);
const History_SelectAnswer_Image = lazy(
  () => import('./LessonComponent/History/History_SelectAnswer_Image'),
);
const History_SelectAnswer_Image_TextImageAnswer = lazy(
  () =>
    import(
      './LessonComponent/History/History_SelectAnswer_Image_TextImageAnswer'
    ),
);
const History_SelectAnswer = lazy(
  () => import('./LessonComponent/History/History_SelectAnswer'),
);
const History_SelectAnswer_Slider = lazy(
  () => import('./LessonComponent/History/History_SelectAnswer_Slider'),
);
const History_SelectImage_Description = lazy(
  () => import('./LessonComponent/History/History_SelectImage_Description'),
);
const HistoryHS1M2 = lazy(
  () => import('./LessonComponent/History/History_HS1M2'),
);
const HistoryHS1M5P1 = lazy(
  () => import('./LessonComponent/History/History_HS1M5P1'),
);
const History_SelectImage_ImageDescription = lazy(
  () =>
    import('./LessonComponent/History/History_SelectImage_ImageDescription'),
);
const HistoryHS2M2P3 = lazy(
  () => import('./LessonComponent/History/History_HS2M2P3'),
);
const HistoryHS1M5P3 = lazy(
  () => import('./LessonComponent/History/History_HS1M5P3'),
);
const HistoryHS2M1P3 = lazy(
  () => import('./LessonComponent/History/History_HS2M1P3'),
);
const HistoryHS4M1P2 = lazy(
  () => import('./LessonComponent/History/History_HS4M1P2'),
);
const History_SelectAnswer_Text = lazy(
  () => import('./LessonComponent/History/History_SelectAnswer_Text'),
);
const HistoryHS6M1P1 = lazy(
  () => import('./LessonComponent/History/History_HS6M1P1'),
);
const History_HS6M1P2 = lazy(
  () => import('./LessonComponent/History/History_HS6M1P2'),
);
const HistoryHS6M1P3 = lazy(
  () => import('./LessonComponent/History/History_HS6M1P3'),
);
const History_HS6M3P1 = lazy(
  () => import('./LessonComponent/History/History_HS6M3P1'),
);

const DragProvider = lazy(() => import('../components/Drag/DragProvider'));
const UseHintModal = lazy(
  () => import('src/core/presentation/components/UseHintModal'),
);

// Re-export commonly used components for pattern matching
import {
  navigateScreen,
  resetNavigator,
} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import {observer} from 'mobx-react';
import {useListQuestions} from 'src/hooks/useListQuestion';
import {RouteProp, useRoute} from '@react-navigation/native';
import useStateCustom from 'src/hooks/useStateCommon';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {SoundGlobalContext} from 'src/core/presentation/hooks/sound/SoundGlobalContext';
import {soundTrack} from 'src/core/presentation/hooks/sound/SoundGlobalProvider';
import {RouteParamsDone} from 'src/core/presentation/screens/DoneLessonScreen';
import {TRAINING_COUNT} from 'src/core/domain/enums/ModuleE';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from '../stores/LessonStore/LessonStore';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {coreModuleContainer} from 'src/core/CoreModule';
import {LessonRef} from '../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {toJS} from 'mobx';

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

  // * English G1
  {
    pattern: /^ENGLISH_EG1M[1-8]$/,
    component: EssayLesson,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG1M(9|10|11|12|13|14|15|16|17)$/,
    component: English_EG4M23,
    props: {},
  },
  // * English G2
  //: TODO: tồn động : M35, 33
  {
    pattern: /^ENGLISH_EG2M(1|3|5|7|9)$/,
    component: VowelsLesson,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG2M(2|4|6|8|10|13|14|15|17)$/,
    component: English_Pronounciation,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG2M(11)$/,
    component: English_DrawerCharacter,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG2M(12)$/,
    component: MultiPronunciationLesson,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG2M(17)$/,
    component: English_PronounciationRepeat,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG2M(18|19|20|21|30|33|35)$/,
    component: English_CombineSentences,
    props: {},
  },
  {
    pattern:
      /^(ENGLISH_EG2M(16|22|23|24|25|26|27|28|29|31|32|34|36|37|38|39|40|42|43|44|45|46|47|48|49|51|52|53|54))$/,
    component: English_SelectAnswer,
    props: {},
  },
  {
    pattern: /^(ENGLISH_EG2M(41)|ENGLISH_EG3M(14|18|26|30|39))$/,
    component: English_QwertyKeyboard,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG(2M(50)|3M(40|41))$/,
    component: English_SelectText,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG2M(20)$/,
    component: English_CharSelector,
    props: {},
  },
  // * English G3
  {
    pattern: /^ENGLISH_EG3M(1|3|5|7|9|20|28|30)$/,
    component: English_CharSelector,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG3M(2|4|6|8|10|11|12)$/,
    component: English_Pronounciation,
    props: {},
  },
  {
    pattern:
      /^ENGLISH_EG3M(13|15|16|17|19|21|22|23|24|27|29|31|32|33|34|35|36|37|38|39|42|43|44|45|46)$/,
    component: English_SelectAnswer,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG3M(25|40|41)$/,
    component: English_SelectText,
    props: {},
  },
  // * English G4
  {
    pattern: /^ENGLISH_EG4M(1|3|5|7|9)$/,
    component: English_CharSelector_Meaning,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG4M(2|4|6|8|10)$/,
    component: English_Pronounciation_Meaning,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG4M(11|12|13|14|20|23|24|27|28|29|30|31|33|34)$/,
    component: English_SelectAnswer,
    props: {},
  },
  {
    pattern: /^ENGLISH_G4M23$/,
    component: English_EG4M23,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG4M(15|16|17|18|19|21|22|25|26|32)$/,
    component: English_SelectText,
    props: {},
  },
  // * English G5
  {
    pattern: /^ENGLISH_EG5M(1|3|5|7|9)$/,
    component: English_CharSelector_Meaning,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG5M(2|4|6|8|10)$/,
    component: English_Pronounciation_Meaning,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG5M(11)$/,
    component: English_QwertyKeyboard,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG5M(12|19|20|22|24|25|26|27|28|29|30|31|32|33|34)$/,
    component: English_SelectAnswer,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG5M(17)$/,
    component: English_SelectAnswer_Paragraph,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG5M(14)$/,
    component: English_SelectText,
    props: {},
  },
  {
    pattern: /^ENGLISH_G5M16$/,
    component: English_G5M16,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG5M(13|15|18|21|23)$/,
    component: English_G5M16,
    props: {},
  },
  // * English G6
  {
    pattern: /^ENGLISH_EG6M(1|3|5|7|9)$/,
    component: English_CharSelector_Meaning,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG6M(2|4|6|8|10)$/,
    component: English_Pronounciation_Meaning,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG6M(11)$/,
    component: English_QwertyKeyboard,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG6M(15|16|17|18)$/,
    component: English_QwertyKeyboard_Paragraph,
    props: {},
  },
  {
    pattern: /^ENGLISH_G6M(25|26)$/,
    component: English_G6M26,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG6M(20|22|23|26|27|28)$/,
    component: English_SelectAnswer,
    props: {},
  },
  {
    pattern: /^ENGLISH_EG6M(12|13|14|19|21|24)$/,
    component: English_SelectAnswer_Paragraph,
    props: {},
  },
  // * Mandarin G2
  {
    pattern: /^MANDARIN_MDG[2-6]M4$/,
    component: Mandarin_G4M_DrawCharacter,
    props: {},
  },
  {
    pattern: /^(writing|MANDARIN_MDG2M(16|19|22|25))$/,
    component: Mandarin_G4M_DrawCharacter,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG2M(17|20|23)$/,
    component: Mandarin_G4M_SelectAnswer,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG2M(18|21|24)$/,
    component: Mandarin_G4_Pronunciation,
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
    pattern: /^MANDARIN_MDG5M(21|24)$/,
    component: Mandarin_G4M_SelectAnswer,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG6M31$/,
    component: Mandarin_G6M31,
    props: {},
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
    pattern: /^(writing|MANDARIN_MDG[1-6]M(1|4|7|10|13|16|19|22|25|28|31))$/,
    component: Mandarin_G4M_DrawCharacter,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG[1-6]M(2|5|8|11|14|17|20|23|26|29|32)$/,
    component: Mandarin_G4M_SelectAnswer,
    props: {},
  },
  {
    pattern: /^MANDARIN_MDG[1-6]M(3|6|9|12|15|18|21|24|27|30|33)$/,
    component: Mandarin_G4_Pronunciation,
    props: {},
  },
  // Vietnamese Lessons
  {
    pattern: /^VIETNAMESE_VNG(0M1|2M2|3M9|4M2)$/,
    component: VnG0M1Lesson,
    props: {},
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
    pattern: /^VIETNAMESE_VNG2M1$/,
    component: VnG2M1Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG2M(3|4|5|6|8|9|10)$/,
    component: VnG2M8Lesson,
    props: {},
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
    props: {},
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
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG6M1$/,
    component: VnG3M1Lesson,
    props: {},
  },
  {
    pattern: /^VIETNAMESE_VNG6M(1_N|2|3|4|5|6|7|8|9|10)$/,
    component: VnG2M8Lesson,
    props: {},
  },

  // Science Lessons

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
    pattern: /^SCIENCE_SG1M(3)$/,
    component: Science_SelectAnswer,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG2M(1|3)$/,
    component: Science_SelectAnswer_Image_TextImageAnswer,
    props: (dataProps: any) => ({
      ...dataProps,
    }),
  },
  {
    pattern: /^SCIENCE_SG2M(2)$/,
    component: Science_SelectAnswer_Image_TextImageAnswer,
    props: (dataProps: any) => ({
      ...dataProps,
      contentContainerStyle: {
        flexDirection: 'row',
        width: '60%',
      },
    }),
  },
  {
    pattern: /^SCIENCE_SG2M(5)$/,
    component: Science_SelectAnswer_2Question,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG2M(6)$/,
    component: Science_SelectAnswer_Explain_TextImageAnswer,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG2M(7)$/,
    component: Science_SelectAnswer_Circle,
    props: {},
  },

  {
    pattern: /^SCIENCE_SG3M(1)$/,
    component: Science_SelectAnswer_ImageLearning,
    props: (dataProps: any) => ({
      ...dataProps,
      isSelectOne: true,
    }),
  },
  {
    pattern: /^SCIENCE_SG3M(2)$/,
    component: Science_SelectAnswer_Image_TextImageAnswer,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG3M(3)$/,
    component: Science_SelectAnswer,
    props: (dataProps: any) => ({
      ...dataProps,
      isSelectOne: true,
    }),
  },
  {
    pattern: /^SCIENCE_SG3M(6)$/,
    component: Science_SelectAnswer_Image_Text,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG3M(4|5|7)$/,
    component: Science_SelectAnswer_Image_TextUnderline,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG3M(8)$/,
    component: Science_SelectAnswer_AnswerImage_MultipleQuestion,
    props: (dataProps: any) => ({
      ...dataProps,
      isMultiQuestion: true,
    }),
  },
  {
    pattern: /^SCIENCE_SG3M(9|10)$/,
    component: Science_SG3M9,
    props: {},
  },

  {
    pattern: /^SCIENCE_SG4M(1)$/,
    component: Science_SelectAnswer_ParagraphImage,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG4M(2)$/,
    component: Science_G4M2,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG4M(3)$/,
    component: Science_SG4M3,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG4M(4)$/,
    component: Science_G4M4,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG4M(5)$/,
    component: Science_G4M5,
  },

  {
    pattern: /^SCIENCE_SG5M(1)$/,
    component: Science_G5M1,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG5M(2)$/,
    component: Science_SG5M2,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG5M(3|4)$/,
    component: Science_SelectAnswer_ScrollQuestion,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG6M(1)$/,
    component: Science_G4M5,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG6M(2)$/,
    component: Science_SelectAnswer_Image_Text,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG6M(4)$/,
    component: Science_SelectAnswer_ImageMeaning_Image,
    props: {},
  },
  {
    pattern: /^SCIENCE_SG[1-6]M\d+$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        SCIENCE_SG1M2: Science_SG1M2,
        SCIENCE_SG2M4: Science_SG2M4,
        SCIENCE_SG2M8:
          testTask?.firstMiniTestTask?.stt === 2
            ? Science_SG2M8
            : Science_SelectAnswer_AnswerMeaning,
        SCIENCE_SG3M9: Science_SG3M9,
        SCIENCE_SG5M5: Science_SG5M5,
        SCIENCE_SG6M3: Science_SG6M3,
      };
      return componentMap[type] || Science_G0M1;
    },
    wrapper: DragProvider,
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
    props: {},
  },
  {
    pattern: /^MATH_MG1M3$/,
    component: (dataProps: any, testTask: any) =>
      testTask?.stt === 4 ? Math_MG1M3_P4 : Math_MG3_KeyboardNumber,
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
    pattern: /^MATH_MG6M(3)$/,
    component: Math_Text_SelectAnswer,
    props: {},
  },
  {
    pattern: /^MATH_MG6M(1|2|3|4|6|7|9|10|11|12|13|14)$/,
    component: Math_G4M_SelectAnswer,
    props: {},
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

  // HIstory module
  {
    pattern: /^HISTORY_HS1M(1)$/,
    component: History_SelectAnswer_Image_TextImageAnswer,
    props: {},
  },
  {
    pattern: /^HISTORY_HS1M2$/,
    component: HistoryHS1M2,
    wrapper: DragProvider,
    props: {},
  },

  {
    pattern: /^HISTORY_HS1M(3|4)$/,
    component: History_SelectAnswer_SwipeImage,
    props: {},
  },

  {
    pattern: /^HISTORY_HS1M(5)$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        HISTORY_HS1M5_P1: HistoryHS1M5P1,
        HISTORY_HS1M5_P2: History_SelectImage_Description,
        HISTORY_HS1M5_P3: HistoryHS1M5P3,
        HISTORY_HS1M5_P4: History_SelectAnswer_Image,
      };

      const stt =
        testTask?.firstMiniTestTask?.type === 'mini_test'
          ? testTask?.firstMiniTestTask?.question?.[0]?.questionType
          : testTask?.stt;

      return componentMap[type + `_P${stt}`] || Science_G0M1;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS(2|3)M(1|2|3|4|5)$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        ['HISTORY_HS1_P3']: <></>,
        [`${type}_P1`]: History_SelectAnswer,
        [`${type}_P2`]: History_SelectImage_ImageDescription,
        [`${type}_P3`]: HistoryHS2M2P3,
      };
      if (type == 'HISTORY_HS2M1' && testTask?.stt == 3) {
        return HistoryHS2M1P3;
      }
      if (testTask?.firstMiniTestTask?.type === 'mini_test') {
        return (
          componentMap[
            type +
              `_P${testTask?.firstMiniTestTask?.question?.[0]?.questionType}`
          ] || Science_G0M1
        );
      } else {
        return componentMap[type + `_P${testTask?.stt}`] || <></>;
      }
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS(4|5)M(1|2|3|4|5|6|7|8|9|10)$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: History_SelectAnswer,
        [`${type}_P2`]: HistoryHS4M1P2,
        [`${type}_P3`]: History_SelectAnswer_Text,
      };
      if (testTask?.firstMiniTestTask?.type === 'mini_test') {
        return (
          componentMap[
            type +
              `_P${testTask?.firstMiniTestTask?.question?.[0]?.questionType}`
          ] || <></>
        );
      } else {
        return componentMap[type + `_P${testTask?.stt}`] || <></>;
      }
    },
    wrapper: DragProvider,

    props: {},
  },
  {
    pattern: /^HISTORY_HS6M1$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: HistoryHS6M1P1,
        [`${type}_P2`]: History_HS6M1P2,
        [`${type}_P3`]: HistoryHS6M1P3,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M2$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: HistoryHS4M1P2,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M3$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: History_HS6M3P1,
        [`${type}_P2`]: HistoryHS6M1P3,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M4$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: History_SelectAnswer,
        [`${type}_P2`]: History_SelectImage_ImageDescription,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M5$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: HistoryHS6M1P1,
        [`${type}_P2`]: History_SelectAnswer_Text,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M6$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: History_SelectAnswer,
        [`${type}_P2`]: History_HS6M3P1,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M7$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: HistoryHS6M1P1,
        [`${type}_P2`]: History_HS6M1P2,
        [`${type}_P3`]: History_SelectAnswer_Text,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M8$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: History_HS6M3P1,
        [`${type}_P2`]: HistoryHS6M1P3,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M9$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: HistoryHS6M1P1,
        [`${type}_P2`]: History_HS6M1P2,
        [`${type}_P3`]: History_SelectAnswer_Text,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M10$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: HistoryHS6M1P1,
        [`${type}_P2`]: History_HS6M1P2,
        [`${type}_P3`]: History_SelectAnswer_Text,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
  },
  {
    pattern: /^HISTORY_HS6M11$/,
    component: (type: string, testTask: any) => {
      const componentMap: Record<string, any> = {
        [`${type}_P1`]: HistoryHS6M1P1,
        [`${type}_P2`]: History_HS6M1P2,
        [`${type}_P3`]: History_SelectAnswer_Text,
      };
      return componentMap[type + `_P${testTask?.stt}`] || null;
    },
    wrapper: DragProvider,
    props: {},
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
    isShowHint,
    toggleUseHint,
    getSetting,
  } = lessonStore;

  const {lessonSetting, characterStyle} = useHomeStore();
  const i18n = useI18n();
  const {tasks: apiTasks} = useListQuestions(route?.lessonId);

  // TODO: check task
  const tasks = useMemo(() => {
    return __DEV__
      ? apiTasks.slice(0, apiTasks.length).map(t => ({
          ...t,
          question: t.question?.slice(0, 5) ?? [],
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
    (answerSelected: string, isCorrectAnswer = false) => {
      console.log('answerSelected', answerSelected);
      console.log('isCorrectAnswer', isCorrectAnswer);
      console.log('lessonIndex', lessonIndex, testTask?.question);
      // * bỏ đi các khoảng trống ở câu trả lời
      const finalAnswer = answerSelected.trim();
      let status: 'completed' | 'failed' = 'failed';
      const isString =
        typeof answerSelected === 'string' &&
        typeof testTask?.question?.[lessonIndex].correctAnswer === 'string';
      if (isString) {
        status =
          finalAnswer ===
          testTask?.question?.[lessonIndex].correctAnswer.toString()
            ? 'completed'
            : 'failed';
      } else {
        status = isCorrectAnswer ? 'completed' : 'failed';
      }

      // * check điều kiện là đang đến part mini test
      if (testTask?.type === firstMiniTestTask?.type) {
        playSound(soundTrack.menu_selection_sound);
        const resultByAnswer: TResult = {
          userId: selectedChild?._id,
          taskId: testTask?.question?.[lessonIndex].taskId,
          questionId: testTask?.question?.[lessonIndex]._id,
          status: status,
          point: testTask?.question?.[lessonIndex].point,
        };

        // * set vào mảng kết quả đã trả lời
        setLessonState({
          result: [...(lessonState.result || []), resultByAnswer],
        });
        /**
         * The lessonIndex >= (testTask?.question.length ?? 1) - 1 condition checks if the lessonIndex is greater than or equal to the index of the last question in the question array. If it is, the condition evaluates to true; otherwise, it evaluates to false.
         * If the condition evaluates to true, the code inside the if statement block will be executed. In this case, it calls the submitModule function and passes resultByAnswer as an argument.
         */

        if (lessonIndex >= (testTask?.question.length ?? 1) - 1) {
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
         * The lessonIndex >= (testTask?.question.length ?? 1) - 1 condition checks if the lessonIndex is greater than or equal to the index of the last question in the question array. If it is, the condition evaluates to true; otherwise, it evaluates to false.
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
      lessonIndex,
      testTask?.question,
      testTask?.type,
      firstMiniTestTask?.type,
      playSound,
      selectedChild?._id,
      setLessonState,
      lessonState.result,
      lessonState.trainingResult,
      submitModule,
      isShowHint,
      toggleUseHint,
      nextPart,
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
    // lưu lại state của lesson khi unmount
    // * lessonId : id của lesson
    // * activeTaskIndex : index của task hiện tại
    // * questionIndex : index của question hiện tại
    return () => {
      lessonStore.upsertQuestion(route.lessonId, lessonIndex, activeTaskIndex);
    };
  }, [activeTaskIndex, lessonIndex, route.lessonId, lessonStore]);

  /**----------------------
   *todo    Logic đi tới câu đã làm khi back lại
   *------------------------**/
  useEffect(() => {
    const list = toJS(lessonStore.currentQuestion) ?? [];
    const saved = list.find(q => q.lessonId === route.lessonId);
    if (saved) {
      setActiveTaskIndex(saved.activeTaskIndex);
      setLessonIndex(saved.questionIndex);
    } else {
      setTrainingCount(TRAINING_COUNT); // * set lại TRANING COUNT về ban đàu
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.lessonId, lessonStore.currentQuestion]);

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
    answer: testTask?.question?.[lessonIndex]?.answers,
    stt: testTask?.stt,
  };

  const LoadingFallback = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4A90D9" />
    </View>
  );

  const buildLesson = () => {
    const questionType = testTask?.question?.[lessonIndex]?.type.trim();
    if (!questionType) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <OnBoardingScreen />
        </Suspense>
      );
    }
    // Find matching pattern
    const matchedPattern = LESSON_PATTERNS.find(pattern => {
      return pattern.pattern.test(questionType);
    });

    if (!matchedPattern) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <OnBoardingScreen />
        </Suspense>
      );
    }

    // Get component - cast về React.ComponentType để TypeScript hiểu đây là JSX component
    let Component: React.ComponentType<any> = matchedPattern.component as any;
    if (
      typeof matchedPattern.component === 'function' &&
      matchedPattern.component.length > 0
    ) {
      Component = (matchedPattern.component as any)(questionType, dataProps);
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
        <Suspense fallback={<LoadingFallback />}>
          <Wrapper>
            <Component {...props} ref={vowelRef} />
          </Wrapper>
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<LoadingFallback />}>
        <Component {...props} ref={vowelRef} />
      </Suspense>
    );
  };

  const buildHint = () => {
    return (
      <View style={styles.hint}>
        <Suspense fallback={<LoadingFallback />}>
          <UseHintModal
            onClose={() => {
              toggleUseHint();
            }}
            onUseHint={onUseHint}
          />
        </Suspense>
      </View>
    );
  };
  const insets = useSafeAreaInsets().bottom;
  const ins = Math.max(insets, 0);

  return (
    <View style={[styles.fill, {paddingBottom: ins}]}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
