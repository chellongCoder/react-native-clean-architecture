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
import {resetNavigator} from '../navigation/actions/RootNavigationActions';
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

type RouteParams = {
  totalResult: TResult[];
};

const DoneLessonScreen = () => {
  const route = useRoute<RouteProp<{param: RouteParams}>>()?.params;
  const totalResultLength = route.totalResult?.length || 0;
  const totalCorrectAnswer =
    route.totalResult.filter((item: TResult) => item.status === 'completed')
      ?.length || 0;
  const styleHook = useGlobalStyle();
  const lessonStore = lessonModuleContainer.getProvided(LessonStore);
  const {deviceToken, selectedChild} = useAuthenticationStore();
  useGetUserSetting(deviceToken, selectedChild?._id ?? '', lessonStore);

  const onUnlockAppSetting = async () => {
    if (
      lessonStore.unlockPercent <=
      (totalCorrectAnswer / totalResultLength) * 100
    ) {
      resetNavigator(STACK_NAVIGATOR.HOME.HOME_SCREEN);
      await unBlockApps();
      lessonStore.changeBlockedAnonymousListAppSystem(undefined);
      lessonStore.resetListAppSystem();
    } else {
      Alert.alert('Your result is not enough to open app lock', '', [
        {
          text: 'Ok',
          onPress: () => resetNavigator(STACK_NAVIGATOR.HOME.HOME_SCREEN),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.titleContainer}
        source={assets.background_andie_1}
        resizeMode="cover">
        <HeaderLesson
          lessonName="ENGLISH"
          module="Module 1: vowels and Consonants"
          part="Part 2: Consonants"
        />
        <Text style={[styleHook.txtWord, styles.text]}>YAYYY !!!</Text>
        <Image
          source={assets.andie_1}
          style={{height: scale(200), width: scale(200)}}
          resizeMode="contain"
        />
      </ImageBackground>
      <BookView
        style={styles.achievementContainer}
        contentStyle={styles.content}
        colorBg="#E5592C"
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
              AMAZING !!!
            </Text>
            <Text
              style={[styleHook.txtNote, styles.contentDescription]}
              textBreakStrategy="balanced">
              Good job!!! You have{' '}
              <Text style={[{fontWeight: 'bold'}]}>
                {totalCorrectAnswer}/{route.totalResult.length || 0} correct
                answers
              </Text>
              , now let’s practice again 2 more times
            </Text>
          </View>
          <View style={styles.wrapStarContainer}>
            <Image
              source={assets.untitled_artwork}
              style={styles.star}
              resizeMode="contain"
            />
            <Text style={styles.starText}>{0}</Text>
          </View>
        </View>
        <View style={styles.wrapperButton}>
          {/* <TouchableOpacity style={styles.button}>
            <Text style={[styleHook.txtButton, styles.textBtn]}>
              Receive award
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={onUnlockAppSetting} style={styles.button}>
            <Text style={[styleHook.txtButton, styles.textBtn]}>Next</Text>
          </TouchableOpacity>
        </View>
      </BookView>
    </View>
  );
};
export default DoneLessonScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBF8CC',
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
