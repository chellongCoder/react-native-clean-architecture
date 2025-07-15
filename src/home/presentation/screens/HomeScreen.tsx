import React, {Fragment} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import ListSubject from '../components/subjects/ListSubject';
import AccountStatus from '../components/AccountStatus';
import {scale} from 'react-native-size-matters';
import {observer} from 'mobx-react';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {HomeProvider} from '../stores/HomeProvider';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';

const HomeScreen = observer(() => {
  const inset = useSafeAreaInsets();
  return (
    <Fragment>
      <View style={[styles.container]}>
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={{alignItems: 'flex-start'}}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <FastImage
            source={{
              uri: 'https://storage.googleapis.com/alphadex-image-abeeci/backgrounds/bg-HOME.png',
            }}
            style={[styles.image, {height: WIDTH_SCREEN * 3.35, width: '100%'}]}
            resizeMode="contain"
          />
          <View
            style={[[styles.wrapContentContainer, {paddingTop: inset.top}]]}>
            <View
              style={{
                position: 'absolute',
                right: scale(10),
                zIndex: 999,
                top: inset.top,
              }}>
              <AccountStatus />
            </View>
            <ListSubject />
          </View>
        </ScrollView>
      </View>
    </Fragment>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapContentContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
  },
  image: {
    width: '100%',
  },
});

export default withProviders(HomeProvider)(HomeScreen);
