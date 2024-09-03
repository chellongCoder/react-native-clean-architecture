import React, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import useGlobalStyle from '../hooks/useGlobalStyle';
import ICStar from 'src/core/components/icons/ICStar';
import {STACK_NAVIGATOR} from '../navigation/ConstantNavigator';
import {
  goBack,
  resetNavigator,
} from '../navigation/actions/RootNavigationActions';
import {unBlockApps} from 'react-native-alphadex-screentime';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';
import {RouteProp, useRoute} from '@react-navigation/native';
import {TResult} from 'src/lesson/presentation/screens/LessonScreen';
import {useGetUserSetting} from 'src/hooks/useGetUserSetting';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import BookView from 'src/lesson/presentation/components/BookView';
import {assets} from '../utils';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../constants/colors';
import {CustomTextStyle} from '../constants/typography';
import HeaderLesson from 'src/lesson/presentation/components/HeaderLesson';
import {FontFamily} from '../hooks/useFonts';
import Toast from 'react-native-toast-message';
import {useCallback, useEffect, useMemo, useState} from 'react';
import OnBoardingMinitestScreen from './OnBoardingMinitestScreen';
import Animated, {Easing, FadeIn} from 'react-native-reanimated';
import {TRAINING_COUNT} from 'src/core/domain/enums/ModuleE';

export type RouteParamsDone = {
  totalResult: TResult[];
  colorBgBookView?: string;
  backgroundAndie: React.ImageSourcePropType | string;
  andieImage: React.ImageSourcePropType | string;
  title: string;
  note: string;
  isMiniTest?: boolean;
  countTime?: string;
  moduleName?: string;
  lessonName?: string;
  partName?: string;
};

const DoneLessonScreen = () => {
  const route = useRoute<RouteProp<{param: RouteParamsDone}>>()?.params;

  const totalResultLength = route.totalResult?.length || 0;
  const totalCorrectAnswer =
    route.totalResult.filter((item: TResult) => item.status === 'completed')
      ?.length || 0;
  const styleHook = useGlobalStyle();
  const lessonStore = lessonModuleContainer.getProvided(LessonStore);

  const {deviceToken, selectedChild} = useAuthenticationStore();
  const [isShowOnBoard, setIsShowOnBoard] = useState(false);
  useGetUserSetting(deviceToken, selectedChild?._id ?? '', lessonStore);

  const isSuccess = useMemo(
    () =>
      lessonStore.unlockPercent <=
      (totalCorrectAnswer / totalResultLength) * 100,
    [lessonStore.unlockPercent, totalCorrectAnswer, totalResultLength],
  );

  const onUnlockAppSetting = useCallback(async () => {
    if (isSuccess) {
      await unBlockApps();
      lessonStore.changeBlockedAnonymousListAppSystem(undefined);
      lessonStore.resetListAppSystem();
      Toast.show({
        type: 'success',
        text1: 'Your apps have been unlocked',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Your result is not enough to open app lock',
      });
    }
  }, [isSuccess, lessonStore]);

  const onSubmit = useCallback(() => {
    if (route.isMiniTest) {
      resetNavigator(STACK_NAVIGATOR.HOME.HOME_SCREEN);
      lessonStore.setTrainingCount(TRAINING_COUNT);
    } else {
      if (lessonStore.trainingCount === 0) {
        setIsShowOnBoard(true);
        setTimeout(() => {
          goBack();
        }, 2000);
      } else {
        goBack();
      }
    }
  }, [lessonStore, route.isMiniTest]);

  useEffect(() => {
    if (route.isMiniTest) {
      onUnlockAppSetting();
    }
  }, [onUnlockAppSetting, route.isMiniTest]);

  if (!isSuccess) {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.titleContainer}
          source={
            typeof route.backgroundAndie === 'string'
              ? {uri: route.backgroundAndie}
              : route.backgroundAndie
          }
          resizeMode="cover">
          <HeaderLesson
            lessonName={route.lessonName}
            module={route.moduleName}
            part={route.partName}
          />
          <Text style={[styleHook.txtWord, styles.text]}>OH NOO !!!</Text>
          <Image
            source={
              typeof route.andieImage === 'string'
                ? {uri: route.andieImage}
                : route.andieImage
            }
            style={{height: scale(200), width: scale(200)}}
            resizeMode="contain"
          />
        </ImageBackground>
        <BookView
          style={styles.achievementContainer}
          contentStyle={styles.content}
          colorBg={COLORS.YELLOW_F2B559}
          imageBackground={assets.bee_bg}>
          <View style={styles.achievementContent}>
            <View style={styles.wrapperContent}>
              <Text style={[styleHook.txtModule, styles.contentTitle]}>
                {'UNSUCCESSFUL'} !!!
              </Text>
              <Text
                style={[styleHook.txtNote, styles.contentDescription]}
                textBreakStrategy="balanced">
                SORRY. You can not pass the test. You need to start all over
                again. You can do it !
              </Text>
            </View>
          </View>
          <View style={styles.wrapperButton}>
            <TouchableOpacity
              onPress={onSubmit}
              style={[
                styles.button,
                !isSuccess && {backgroundColor: COLORS.GREEN_66C270},
              ]}>
              <Text style={[styleHook.txtButton, styles.textBtn]}>Next</Text>
            </TouchableOpacity>
          </View>
        </BookView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.titleContainer}
        source={
          typeof route.backgroundAndie === 'string'
            ? {uri: route.backgroundAndie}
            : route.backgroundAndie
        }
        resizeMode="cover">
        <HeaderLesson
          lessonName={route.lessonName}
          module={route.moduleName}
          part={route.partName}
        />
        <Text style={[styleHook.txtWord, styles.text]}>YAYYY !!!</Text>
        <Image
          source={
            typeof route.andieImage === 'string'
              ? {uri: route.andieImage}
              : route.andieImage
          }
          style={{height: scale(200), width: scale(200)}}
          resizeMode="contain"
        />
      </ImageBackground>
      <BookView
        style={styles.achievementContainer}
        contentStyle={styles.content}
        colorBg={route.colorBgBookView}
        imageBackground={assets.bee_bg}>
        <View style={styles.achievementContent}>
          <View style={styles.backgroundStar}>
            <Image
              source={assets.achievement_icon_new}
              resizeMode="contain"
              style={{height: '100%', width: '100%'}}
            />
          </View>
          <View style={styles.wrapperContent}>
            <Text style={[styleHook.txtModule, styles.contentTitle]}>
              {route.title} !!!
            </Text>
            <Text
              style={[styleHook.txtNote, styles.contentDescription]}
              textBreakStrategy="balanced">
              Good job!!! Now let’s practice again{' '}
              {route.countTime && (
                <Text style={[{fontFamily: FontFamily.Eina01Bold}]}>
                  {route.countTime ?? ''} {'\n'}
                </Text>
              )}
              {route.note}
            </Text>
          </View>
          {route.isMiniTest && (
            <View style={styles.wrapStarContainer}>
              <Image
                source={assets.untitled_artwork}
                style={styles.star}
                resizeMode="contain"
              />
              <Text style={styles.starText}>{0}</Text>
            </View>
          )}
        </View>
        <View style={styles.wrapperButton}>
          <TouchableOpacity onPress={onSubmit} style={styles.button}>
            <Text style={[styleHook.txtButton, styles.textBtn]}>Next</Text>
          </TouchableOpacity>
        </View>
      </BookView>
      {isShowOnBoard && (
        <Animated.View
          entering={FadeIn.duration(200).easing(Easing.ease)}
          style={{
            position: 'absolute',
            zIndex: 999,
            width: '100%',
            height: '100%',
          }}>
          <OnBoardingMinitestScreen />
        </Animated.View>
      )}
    </View>
  );
};
export default DoneLessonScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  titleContainer: {
    // height: '50%',
    width: '100%',
    paddingBottom: scale(24),
    alignItems: 'center',
  },
  text: {
    fontWeight: '400',
    fontSize: 40,
    textAlign: 'center',
    color: '#FBF8CC',
  },
  content: {marginTop: 80, marginBottom: 0, flex: 1},
  subText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#258F78',
    marginTop: 30,
  },
  boxAnswer: {
    flex: 1,
    padding: 32,
  },
  achievementContainer: {
    flex: 1,
    width: '100%',
    marginTop: scale(-24),
    // height: '60%',
    // position: 'relative',
    // paddingTop: 80,
  },
  achievementContent: {
    backgroundColor: '#FBF8CC',
    borderRadius: 30,
    // height: 271,
    flex: 1,
    width: '85%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // position: 'relative',
  },
  backgroundStar: {
    width: 138,
    height: 138,
    borderRadius: 100,
    top: -69,
    left: '50%',
    transform: [{translateX: -70}],
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperContent: {
    marginTop: 100,
    marginLeft: 30,
    marginRight: 30,
  },
  contentTitle: {
    fontSize: scale(24),
    color: '#4CB572',
    marginBottom: 10,
    textAlign: 'center',
  },
  wrapStarContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    borderWidth: 2,
    borderRadius: scale(20),
    borderColor: COLORS.GREEN_66C270,
    marginTop: scale(24),
  },
  star: {
    width: 32,
    height: 32,
    marginLeft: -4,
  },
  starText: {
    marginLeft: scale(2),
    ...CustomTextStyle.smallBold,
    color: COLORS.GREEN_66C270,
    fontSize: scale(12),
  },
  contentDescription: {
    fontSize: 8,
    color: '#1C6349',
    textAlign: 'center',
  },
  wrapperDot: {
    width: '100%',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  Dot: {
    width: 39,
    height: 39,
    borderRadius: 100,
    backgroundColor: '#66C270',
  },
  numberDot: {
    fontSize: 15,
    color: '#1C6349',
    fontWeight: 'bold',
  },
  wrapperButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    flexDirection: 'row',
    gap: 30,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#F2B559',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 32,
    alignSelf: 'center',
  },
  textBtn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FBF8CC',
  },
});
