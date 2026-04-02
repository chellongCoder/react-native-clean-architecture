import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ICBook from 'src/core/components/icons/ICBook';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {COLORS} from 'src/core/presentation/constants/colors';
import Button from './Button';
import {scale, verticalScale} from 'react-native-size-matters';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import {usePopupTrialMode} from 'src/core/presentation/hooks/popup/usePopupTrialMode';
import useAuthenStore from 'src/authentication/presentation/hooks/useAuthenStore';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {ModuleItemProps} from 'src/home/presentation/stores/types/HomeStoreState';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {IClock} from '../icons';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import {observer} from 'mobx-react';
import FastImage from 'react-native-fast-image';

const ModuleItem = observer((props: ModuleItemProps) => {
  const globalStyle = useGlobalStyle();
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService
  const translateX = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const i18n = useI18n();
  const popupHook = usePopupTrialMode();
  const authStore = useAuthenStore();
  const homeStore = useHomeStore();
  const lessonStore = useLessonStore();
  const [trialStatus, setTrialStatus] = useState<string>();

  const isLocked = useMemo(() => {
    return (
      trialStatus === 'end_trial' &&
      !lessonStore.userModule?.find(module => module.id === props.id)
    );
  }, [lessonStore.userModule, props.id, trialStatus]);

  const gotoLesson = useCallback(() => {
    navigateScreen(STACK_NAVIGATOR.HOME.LESSON, {
      lessonId: props.id,
      lessonName: props.lessonName,
      moduleName: props.title,
    });
  }, [props.id, props.lessonName, props.title]);

  const onStartDoing = useCallback(async () => {
    if (trialStatus === 'being_trial') {
      gotoLesson();
    } else {
      if (trialStatus === 'no_trial') {
        popupHook.handleToggleTrialPopup();
      } else if (trialStatus === 'end_trial') {
        if (isLocked) {
          popupHook.handleToggleTrialPopup();
        } else {
          gotoLesson();
        }
      }
    }
  }, [trialStatus, gotoLesson, popupHook, isLocked]);

  const renderIcon = () =>
    props?.image ? (
      <FastImage
        source={{uri: env.IMAGE_MODULE_BASE_API_URL + props?.image}}
        style={styles.icon}
        resizeMode="contain"
      />
    ) : (
      <ICBook width={32} height={25} color={COLORS.WHITE} />
    );

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  useAsyncEffect(async () => {
    const _trialStatus = homeStore.checkDoingModule(
      authStore.userProfile,
      props,
    );
    setTrialStatus(_trialStatus);
  }, [homeStore, authStore.userProfile, props]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
      opacity: opacity.value,
    };
  });
  return !props.isFinished ? (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: COLORS.WHITE_FBF8CC},
        animatedStyle,
      ]}>
      <View style={[globalStyle.rowCenter]}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: COLORS.YELLOW_F2B559},
          ]}>
          {renderIcon()}
        </View>
        <View style={{width: scale(22)}} />
        <View style={styles.textContainer}>
          <TouchableOpacity>
            <Text
              numberOfLines={2}
              style={[styles.title, globalStyle.txtLabel]}>
              {props.title}
            </Text>
          </TouchableOpacity>
          <View style={{height: verticalScale(4)}} />
          <Text style={[styles.subtitle, globalStyle.txtNote]}>
            {props.subTitle}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity>
          <Text style={[styles.title, globalStyle.txtLabel]}>
            {props.progress}/{props.totalQuestion}
          </Text>
        </TouchableOpacity>
        <View style={{height: verticalScale(14)}} />
        <Button
          onPress={onStartDoing}
          color={COLORS.GREEN_66C270}
          title={i18n.t('lesson.screens.Modules.study')}
          icon={
            isLocked ? (
              <IClock width={scale(16)} height={scale(16)} />
            ) : undefined
          }
        />
      </View>
    </Animated.View>
  ) : (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: COLORS.GREEN_66C270},
        animatedStyle,
      ]}>
      <View style={[globalStyle.rowCenter]}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: COLORS.WHITE_FBF8CC},
          ]}>
          {renderIcon()}
        </View>
        <View style={{width: scale(22)}} />
        <View style={styles.textContainer}>
          <Text numberOfLines={2} style={[styles.title, globalStyle.txtLabel]}>
            {props.title}
          </Text>
          <View style={{height: verticalScale(4)}} />
          <Text style={[styles.subtitle, globalStyle.txtNote]}>
            {props.subTitle}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity>
          <Text style={[styles.title, globalStyle.txtLabel]}>
            {props.progress}/{props.totalQuestion}
          </Text>
        </TouchableOpacity>
        <View style={{height: verticalScale(10)}} />

        <Button
          onPress={onStartDoing}
          color={COLORS.YELLOW_F2B559}
          title={i18n.t('lesson.screens.Modules.revision')}
          icon={
            isLocked ? (
              <IClock width={scale(16)} height={scale(16)} />
            ) : undefined
          }
        />
      </View>
    </Animated.View>
  );
});

export default ModuleItem;

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: 'blue',
    width: scale(60),
    height: scale(60),
    borderRadius: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {height: '80%', width: '80%'},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderRadius: scale(30),
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    color: COLORS.GREEN_1C6349,
    maxWidth: scale(100),
  },
  subtitle: {
    color: COLORS.GREEN_1C6349,
    maxWidth: scale(120),
    paddingVertical: verticalScale(10),
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBlockApp: {
    width: scale(70.23),
    height: verticalScale(28),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.GREEN_66C270,
  },
});
