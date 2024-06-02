import * as React from 'react';
import {STACK_NAVIGATOR} from './ConstantNavigator';
import {createStackNavigator} from '@react-navigation/stack';
import {AppStack} from './RootNavigator';
import TabNavigator from './tabNavigator/TabNavigator';
import {hideBottomTab, showBottomTab} from './actions/RootNavigationActions';
import PostsScreen from 'src/post/presentation/screens/PostsScreen';
import LessonScreen from 'src/lesson/presentation/screens/LessonScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import DoneLessonScreen from '../screens/DoneLessonScreen';
import HomeScreen from 'src/home/presentation/HomeScreen';
import SubjectScreen from 'src/home/presentation/SubjectScreen';
import AchievementScreen from 'src/achievement/presentation/AchievementScreen';
import RankScreen from 'src/rank/presentation/RankScreen';
import LoginScreen from 'src/post/presentation/screens/LoginScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import DoneLessonScreen from '../screens/DoneLessonScreen';

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const TargetStack = createStackNavigator();
const ParentStack = createStackNavigator();
const ChildStack = createStackNavigator();
const AchievementStack = createStackNavigator();
const RankStack = createStackNavigator();

export const AuthStackScreens = (): React.ReactElement => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
      }}
      initialRouteName={STACK_NAVIGATOR.ONBOARDING_NAVIGATOR}>
      <AppStack.Screen
        name={STACK_NAVIGATOR.ONBOARDING_NAVIGATOR}
        key={STACK_NAVIGATOR.ONBOARDING_NAVIGATOR}
        component={OnBoardingScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            hideBottomTab(navBottom);
          },
        })}
      />
      <AuthStack.Screen
        name={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        key={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        component={LoginScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            hideBottomTab(navBottom);
          },
        })}
      />
    </AuthStack.Navigator>
  );
};

export const HomeStackScreens = (): React.ReactElement => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
      }}>
      <HomeStack.Screen
        name={STACK_NAVIGATOR.HOME.HOME_SCREEN}
        key={STACK_NAVIGATOR.HOME.HOME_SCREEN}
        component={HomeScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      />
      <HomeStack.Screen
        name={STACK_NAVIGATOR.HOME.LESSON}
        key={STACK_NAVIGATOR.HOME.LESSON}
        component={LessonScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            hideBottomTab(navBottom);
          },
        })}
      />
      <HomeStack.Screen
        name={STACK_NAVIGATOR.HOME.SUBJECT_SCREEN}
        key={STACK_NAVIGATOR.HOME.SUBJECT_SCREEN}
        component={SubjectScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      />
      <HomeStack.Screen
        name={STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN}
        key={STACK_NAVIGATOR.HOME.DONE_LESSON_SCREEN}
        component={DoneLessonScreen}
      />
    </HomeStack.Navigator>
  );
};

export const TargetStackScreens = (): React.ReactElement => {
  return (
    <TargetStack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
      }}>
      <TargetStack.Screen
        name={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        key={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        component={PostsScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      />
      {/* <TargetStack.Screen
        name={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        key={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        component={Login}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      /> */}
    </TargetStack.Navigator>
  );
};

export const ParentStackScreens = (): React.ReactElement => {
  return (
    <ParentStack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
      }}>
      <ParentStack.Screen
        name={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        key={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        component={PostsScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      />
      {/* <ParentStack.Screen
        name={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        key={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        component={Login}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      /> */}
    </ParentStack.Navigator>
  );
};

export const ChildStackScreens = (): React.ReactElement => {
  return (
    <ChildStack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
      }}>
      <ChildStack.Screen
        name={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        key={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        component={PostsScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      />
      {/* <ChildStack.Screen
        name={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        key={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        component={Login}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      /> */}
    </ChildStack.Navigator>
  );
};

export const AchievementStackScreens = (): React.ReactElement => {
  return (
    <AchievementStack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
      }}>
      <AchievementStack.Screen
        name={STACK_NAVIGATOR.ACHIEVEMENT.ACHIEVEMENT_SCREEN}
        key={STACK_NAVIGATOR.ACHIEVEMENT.ACHIEVEMENT_SCREEN}
        component={AchievementScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      />
      {/* <AchievementStack.Screen
        name={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        key={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        component={Login}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      /> */}
    </AchievementStack.Navigator>
  );
};

export const RankStackScreens = (): React.ReactElement => {
  return (
    <RankStack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
      }}>
      <RankStack.Screen
        name={STACK_NAVIGATOR.RANK.RANK_SCREEN}
        key={STACK_NAVIGATOR.RANK.RANK_SCREEN}
        component={RankScreen}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      />
      {/* <RankStack.Screen
        name={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        key={STACK_NAVIGATOR.AUTH.LOGIN_SCREEN}
        component={Login}
        listeners={({navigation: navBottom}) => ({
          focus: () => {
            showBottomTab(navBottom);
          },
        })}
      /> */}
    </RankStack.Navigator>
  );
};

function AppNavigator(): React.ReactElement {
  return (
    <>
      <AppStack.Screen
        name={STACK_NAVIGATOR.AUTH_NAVIGATOR}
        key={STACK_NAVIGATOR.AUTH_NAVIGATOR}
        component={AuthStackScreens}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB_SCREENS}
        key={STACK_NAVIGATOR.BOTTOM_TAB_SCREENS}
        component={TabNavigator}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.TARGET_NAVIGATOR}
        key={STACK_NAVIGATOR.TARGET_NAVIGATOR}
        component={TargetStackScreens}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.PARENT_NAVIGATOR}
        key={STACK_NAVIGATOR.PARENT_NAVIGATOR}
        component={ParentStackScreens}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.CHILD_NAVIGATOR}
        key={STACK_NAVIGATOR.CHILD_NAVIGATOR}
        component={ChildStackScreens}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.ACHIEVEMENT_NAVIGATOR}
        key={STACK_NAVIGATOR.ACHIEVEMENT_NAVIGATOR}
        component={AchievementStackScreens}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.RANK_NAVIGATOR}
        key={STACK_NAVIGATOR.RANK_NAVIGATOR}
        component={RankStackScreens}
      />
    </>
  );
}

export default AppNavigator;
