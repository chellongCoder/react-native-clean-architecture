import React, {Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from 'src/core/presentation/constants/colors';
import ListSubject from '../components/ListSubject';
import AccountStatus from '../components/AccountStatus';
import {scale} from 'react-native-size-matters';
import {observer} from 'mobx-react';

const HomeScreen = observer(() => {
  return (
    <Fragment>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.wrapContentContainer}>
          <AccountStatus isShowLogout={true} />
          <ListSubject />
        </View>
      </SafeAreaView>
    </Fragment>
  );
});

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

export default HomeScreen;
