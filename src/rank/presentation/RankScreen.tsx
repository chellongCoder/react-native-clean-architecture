import React, {Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import AccountStatus from 'src/home/presentation/components/AccountStatus';
import YourRank from '../components/YourRank';
import Top50Rank from '../components/Top50Rank';
import {LessonStoreProvider} from 'src/lesson/presentation/stores/LessonStore/LessonStoreProvider';
import {withProviders} from 'src/core/presentation/utils/withProviders';

const RankScreen = () => {
  return (
    <Fragment>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.wrapContentContainer}>
          <View style={styles.ph16}>
            <AccountStatus title="Top Rank" subject="Try your best" />
          </View>
          <YourRank />
          <Top50Rank />
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
  },
  ph16: {
    paddingHorizontal: scale(16),
  },
});

export default withProviders(LessonStoreProvider)(RankScreen);
