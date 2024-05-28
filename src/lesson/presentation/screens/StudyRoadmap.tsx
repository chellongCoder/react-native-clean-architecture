import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ModuleItem from '../components/LessonModule/ModuleItem';

const StudyRoadmapScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{paddingTop: insets.top}}>
      <Text>StudyRoadmap</Text>
      <ModuleItem isFinished />
    </View>
  );
};

export default StudyRoadmapScreen;

const styles = StyleSheet.create({});
