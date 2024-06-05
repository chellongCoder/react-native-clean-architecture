import {StyleSheet, View} from 'react-native';
import React from 'react';
import ChartProfile from '../components/ChartProfile';

const ProfileScreen = () => {
  return (
    <View style={[styles.fill, styles.justifyContentCenter, styles.ph16]}>
      <ChartProfile
        valuesAxitX={['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']}
        valueY={[80, 60, 5, 15, 30, 44, 333]}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  ph16: {
    paddingHorizontal: 16,
  },
});
