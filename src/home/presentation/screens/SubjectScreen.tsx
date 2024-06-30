import React, {Fragment} from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AccountStatus from '../components/AccountStatus';
import {COLORS} from 'src/core/presentation/constants/colors';
import {scale} from 'react-native-size-matters';
import ListLesson from '../components/ListLesson';
import ListModule from '../components/ListModule';
import {observer} from 'mobx-react';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {HomeProvider} from '../stores/HomeProvider';

const SubjectScreen = observer((props: any) => {
  const {route} = props;

  return (
    <Fragment>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.wrapContentContainer}>
          <View style={{paddingHorizontal: scale(16)}}>
            <AccountStatus title={'Lessons'} subject={route?.params?.subject} />
          </View>
          <ListLesson />
          <View style={{paddingHorizontal: scale(16), flex: 1}}>
            <ListModule />
          </View>
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
  },
});

export default withProviders(HomeProvider)(SubjectScreen);
