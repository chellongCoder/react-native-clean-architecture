import React from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {
  CustomTextStyle,
  TYPOGRAPHY,
} from 'src/core/presentation/constants/typography';
import ModuleItem from 'src/lesson/presentation/components/LessonModule/ModuleItem';
import {useListModule} from 'src/hooks/useListModule';
import {observer} from 'mobx-react';
import useHomeStore from '../stores/useHomeStore';
import BookView from 'src/lesson/presentation/components/BookView';
import ListGrade from 'src/lesson/presentation/components/LessonModule/ListGrade';
import LoadingItem from 'src/lesson/presentation/components/Loading/LoadingItem';

const screenWidth = Dimensions.get('screen').width;

const ListModule = observer(() => {
  const {selectedSubject, modules, isLoading} = useListModule();

  const {listSubject, subjectId, listModule} = useHomeStore();

  const totalQuestions = listModule?.reduce(
    (acc, item) => acc + item.totalQuestion,
    0,
  );

  const totalProgressQuestions = listModule?.reduce(
    (acc, item) => acc + item.progressOfChildren,
    0,
  );

  return (
    <BookView style={styles.container} contentStyle={styles.contentBg}>
      <ListGrade />
      <View style={styles.gradeContainer}>
        <Text style={styles.txtGrade}>
          {listSubject.find(e => e._id === subjectId)?.description}
        </Text>
      </View>
      <ScrollView
        style={[styles.f1, {height: verticalScale(300)}]}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: scale(54)}}>
        {isLoading
          ? Array.from({length: 3}).map((_, index) => (
              <View style={styles.wrapModuleContainer}>
                <LoadingItem key={index} />
              </View>
            ))
          : modules?.map(module => {
              return (
                <View style={styles.wrapModuleContainer}>
                  <ModuleItem
                    progress={module.progressOfChildren}
                    totalQuestion={module.totalQuestion}
                    isFinished={module.progressOfChildren > 0}
                    title={module.name}
                    subTitle={module.tasks
                      ?.map(item => '•' + item.description)
                      ?.join('\n')
                      ?.toString()}
                    id={module._id}
                    lessonName={selectedSubject?.description}
                    image={module.image}
                  />
                </View>
              );
            })}
      </ScrollView>
    </BookView>
  );
});

const styles = StyleSheet.create({
  f1: {
    flex: 1,
    marginTop: scale(16),
  },
  container: {
    flex: 1,
    marginTop: scale(16),
    marginHorizontal: scale(-16),
    paddingHorizontal: scale(16),
  },
  contentBg: {
    flex: 1,
  },
  square: {
    height: scale(24),
    width: scale(24),
    backgroundColor: COLORS.WHITE_FFFBE3,
    position: 'absolute',
    left: screenWidth / 2 - scale(12),
    transform: [{rotate: '45deg'}],
    top: scale(-12),
  },
  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    alignItems: 'center',
  },
  headerTitle: {
    ...CustomTextStyle.body1_bold,
    color: COLORS.BLUE_1C6349,
  },
  wrapHeaderScore: {
    borderRadius: scale(32),
    paddingVertical: scale(8),
    paddingHorizontal: scale(20),
    backgroundColor: COLORS.YELLOW_F2B559,
  },
  headerScore: {
    ...CustomTextStyle.smallBold,
    color: COLORS.BLUE_1C6349,
  },
  wrapModuleContainer: {
    marginBottom: scale(8),
  },
  txtGrade: {
    ...CustomTextStyle.h4,
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitBold,
    color: COLORS.BLUE_258F78,
  },
  gradeContainer: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    alignItems: 'center',
    paddingVertical: scale(5),
    borderRadius: scale(20),
    marginTop: verticalScale(12),
  },
});

export default ListModule;
