import React, {Fragment} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import ListSubject from '../components/subjects/ListSubject';
import AccountStatus from '../components/AccountStatus';
import {scale} from 'react-native-size-matters';
import {observer} from 'mobx-react';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {HomeProvider} from '../stores/HomeProvider';
import FastImage from 'react-native-fast-image';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {assets} from 'src/core/presentation/utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HomeScreen = observer(() => {
  const inset = useSafeAreaInsets();
  return (
    <Fragment>
      <View style={[styles.container]}>
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <FastImage
            source={assets.bg_scroll}
            style={[styles.image, {height: SCREEN_HEIGHT * 2, width: '100%'}]}
            resizeMode="cover"
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
