import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GoogleAdsmobProvider} from '../hooks/ggads/GoogleAdsmobProvider';
import DoneLessonScreen from './DoneLessonScreen';

const GoogleAdmobWapper = () => {
  return (
    <GoogleAdsmobProvider>
      <DoneLessonScreen />
    </GoogleAdsmobProvider>
  );
};

export default GoogleAdmobWapper;

const styles = StyleSheet.create({});
