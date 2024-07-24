import React from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import ModuleItem from 'src/lesson/presentation/components/LessonModule/ModuleItem';
import {useListModule} from 'src/hooks/useListModule';
import {observer} from 'mobx-react';
import useHomeStore from '../stores/useHomeStore';

const screenWidth = Dimensions.get('screen').width;

const ListModule = observer(() => {
  const {modules, selectedSubject} = useListModule();
  const {listSubject, subjectId} = useHomeStore();

  const totalQuestions = modules.reduce(
    (acc, item) => acc + item.totalQuestion,
    0,
  );

  const totalProgressQuestions = modules.reduce(
    (acc, item) => acc + item.progressOfChildren,
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.square} />
      <View style={styles.wrapHeaderContainer}>
        <Text style={styles.headerTitle}>
          {listSubject?.filter(item => item?._id === subjectId)[0]?.name}
        </Text>
        <View style={styles.wrapHeaderScore}>
          <Text
            style={
              styles.headerScore
            }>{`${totalProgressQuestions}/${totalQuestions}`}</Text>
        </View>
      </View>
      <ScrollView
        style={styles.f1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: scale(54)}}>
        {modules.map(module => {
          return (
            <View style={styles.wrapModuleContainer}>
              <ModuleItem
                progress={module.progressOfChildren}
                totalQuestion={module.totalQuestion}
                isFinished={module.progressOfChildren === module.totalQuestion}
                title={module.name}
                subTitle={module.description}
                id={module._id}
                lessonName={selectedSubject?.name}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  f1: {
    flex: 1,
    marginTop: scale(16),
  },
  container: {
    flex: 1,
    marginTop: scale(32),
    backgroundColor: COLORS.GREEN_DDF598,
    marginHorizontal: scale(-16),
    paddingHorizontal: scale(16),
    paddingTop: scale(24),
    borderTopRightRadius: scale(32),
    borderTopLeftRadius: scale(32),
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
});

export default ListModule;
