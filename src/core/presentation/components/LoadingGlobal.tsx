import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import {COLORS} from '../constants/colors';

const DIMENSION = Dimensions.get('window');

const LoadingGlobal = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={COLORS.PRIMARY} />
    </View>
  );
};

export default LoadingGlobal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: DIMENSION.width,
    height: DIMENSION.height,
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.CUSTOM(COLORS.BLACK, 0.5),
  },
});
