import React from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import ModuleItem from 'src/lesson/presentation/components/LessonModule/ModuleItem';

const screenWidth = Dimensions.get('screen').width;

const ListModule = () => {
  return (
    <View style={styles.container}>
      <View style={styles.square} />

      <View style={styles.wrapHeaderContainer}>
        <Text style={styles.headerTitle}>Vietnamese</Text>
        <View style={styles.wrapHeaderScore}>
          <Text style={styles.headerScore}>?/??</Text>
        </View>
      </View>

      <ScrollView style={styles.f1} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapModuleContainer}>
          <ModuleItem isFinished={false} />
        </View>
        <View style={styles.wrapModuleContainer}>
          <ModuleItem isFinished />
        </View>
        <View style={styles.wrapModuleContainer}>
          <ModuleItem isFinished />
        </View>
        <View style={styles.wrapModuleContainer}>
          <ModuleItem isFinished />
        </View>
      </ScrollView>
    </View>
  );
};

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
