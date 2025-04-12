import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ImageSourcePropType,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';
import {assets, HEIGHT_SCREEN} from 'src/core/presentation/utils';
import HeaderModule from './HeaderModule';
import DescriptionModule from './DescriptionModule';
import CharacterModule from './CharacterModule';
import Speaker from './Speaker';
import SelectionAnswersQuestion from '../SelectionAnswersQuestion';
import {ModuleDetailProvider, useModuleDetail} from './hook';
import {Task} from 'src/home/application/types/GetListQuestionResponse';

const ModuleDetail = () => {
  const hook = useModuleDetail();
  const insets = useSafeAreaInsets();
  const [source, setSource] = useState<ImageSourcePropType | undefined>({
    uri: hook.backgroundImage,
  });
  const handleError = () => {
    setSource(assets.background_vowels);
  };
  return (
    <View style={[styles.container]}>
      {/* Background and content section */}
      <ImageBackground
        onError={handleError}
        source={source}
        style={styles.backgroundImage}>
        <View style={[styles.contentContainer, {paddingTop: insets.top}]}>
          {/* Header Module */}
          <HeaderModule
            lessonTitle={hook.lessonName}
            moduleTitle={hook.moduleName}
            modulePart={hook.partName}
            timer="00:09"
            score={0}
            scoreIcon={assets.abcBook}
          />

          {/* Main content - Vietnamese text */}
          <DescriptionModule
            text="DƯỚI ÁNH TRĂNG
              DÒNG SÔNG SÁNG RỰC LÊN
              NHỮNG CON SÓNG NHỎ
              VỖ NHẸ VÀO HAI BỜ CÁT."
          />

          {/* Character Module */}
          <CharacterModule imageSource={assets.andie_1} />
        </View>
      </ImageBackground>

      {/* Answer section */}
      <View style={styles.answerSection}>
        {/* Header with instruction and sound button */}
        <View style={styles.answerHeaderRow}>
          <Text style={styles.chooseText}>Choose correct answer</Text>
          <Speaker />
        </View>

        {/* Using SelectionAnswersQuestion */}
        <View style={styles.selectionContainer}>
          <SelectionAnswersQuestion
            ref={hook.selectionRef}
            question={
              <Text style={styles.instructionText}>
                Tìm chủ ngữ{'\n'}trong câu trên
              </Text>
            }
            answer={hook.answerOptions}
            isShowCorrectContainer={hook.isShowCorrectContainer}
            isAnswerCorrect={hook.isAnswerCorrect}
            onSelectAnswer={hook.handleSelectAnswer}
            learningTimer={hook.learningTimer}
            isSelectOne={true}
          />
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={hook.handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export interface ModuleDetailProps {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
  backgroundImage?: string;
  characterImageSuccess?: string;
  characterImageFail?: string;
}
// The wrapper component that provides the context
const VietnameseLessonScreen = (props: ModuleDetailProps) => {
  return (
    <ModuleDetailProvider {...props}>
      <ModuleDetail />
    </ModuleDetailProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: 'cover',
    height: HEIGHT_SCREEN / 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  selectionContainer: {
    height: HEIGHT_SCREEN / 3,
    width: '100%',
  },
  answerSection: {
    backgroundColor: '#FFF5E6',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    paddingHorizontal: scale(20),
    paddingTop: scale(10),
    paddingBottom: scale(30),
    marginTop: -scale(20),
    flexDirection: 'column',
    gap: scale(20),
  },
  answerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chooseText: {
    fontSize: scale(16),
    color: '#8B4513',
    fontWeight: '500',
  },
  instructionText: {
    color: '#1D8A63',
    fontSize: scale(18),
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#D86D29',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(20),
    alignSelf: 'center',
    minWidth: scale(120),
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: '600',
  },
});

export default VietnameseLessonScreen;
