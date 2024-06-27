import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import BottomTabBar from './BottomTabBar';
import {STACK_NAVIGATOR} from '../ConstantNavigator';
import {
  HomeStackScreens,
  ParentStackScreens,
  ChildStackScreens,
  AchievementStackScreens,
  RankStackScreens,
} from '../AppNavigator';
import StudyRoadmapScreen from 'src/lesson/presentation/screens/StudyRoadmap';

const BottomTab = createBottomTabNavigator();

export default function TabNavigator(): React.ReactElement {
  function customTabBar(props: BottomTabBarProps) {
    return <BottomTabBar {...props} />;
  }
  return (
    <BottomTab.Navigator
      tabBar={customTabBar}
      screenOptions={{
        headerShown: false,
      }}>
      <BottomTab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.HOME_TAB}
        key={STACK_NAVIGATOR.BOTTOM_TAB.HOME_TAB}
        component={HomeStackScreens}
      />
      <BottomTab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.TARGET_TAB}
        key={STACK_NAVIGATOR.BOTTOM_TAB.TARGET_TAB}
        component={StudyRoadmapScreen}
      />
      <BottomTab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.PARENT_TAB}
        key={STACK_NAVIGATOR.BOTTOM_TAB.PARENT_TAB}
        component={ParentStackScreens}
      />
      <BottomTab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.CHILD_TAB}
        key={STACK_NAVIGATOR.BOTTOM_TAB.CHILD_TAB}
        component={ChildStackScreens}
      />
      <BottomTab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.ACHIEVEMENT_TAB}
        key={STACK_NAVIGATOR.BOTTOM_TAB.ACHIEVEMENT_TAB}
        component={AchievementStackScreens}
      />
      <BottomTab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.RANK_TAB}
        key={STACK_NAVIGATOR.BOTTOM_TAB.RANK_TAB}
        component={RankStackScreens}
      />
    </BottomTab.Navigator>
  );
}
