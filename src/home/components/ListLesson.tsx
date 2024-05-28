import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';

const ListLesson = () => {
  const onLeanLesson = () => {
    navigateScreen(STACK_NAVIGATOR.HOME.LESSON);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.wrapLessonContainer}
        onPress={onLeanLesson}>
        <Text style={styles.lessonTitle}>Tiếng Việt</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: scale(16),
  },
  wrapLessonContainer: {
    width: scale(174),
    height: scale(232),
    borderRadius: scale(30),
    backgroundColor: COLORS.BLUE_258F78,
    alignItems: 'center',
  },
  lessonTitle: {
    ...CustomTextStyle.h1,
    color: COLORS.YELLOW_FFBF60,
    marginTop: scale(48),
  },
});

export default ListLesson;
