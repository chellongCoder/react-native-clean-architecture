import React, {Fragment} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import AccountStatus from 'src/home/components/AccountStatus';

const AchievementScreen = () => {
  return (
    <Fragment>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.wrapContentContainer}>
          <AccountStatus title="Achievement" subject="Collect your award" />
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE_FFFBE3,
  },
  wrapContentContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
});

export default AchievementScreen;
