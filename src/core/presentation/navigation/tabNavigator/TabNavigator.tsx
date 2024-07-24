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
import {View} from 'react-native';
import {StyleSheet} from 'react-native';

const BottomTab = createBottomTabNavigator();

export default function TabNavigator(): React.ReactElement {
  function customTabBar(props: BottomTabBarProps) {
    return (
      <View style={styles.tabBarBackground}>
        <BottomTabBar {...props} />
      </View>
    );
  }
  return (
    <BottomTab.Navigator
      tabBar={customTabBar}
      initialRouteName={STACK_NAVIGATOR.BOTTOM_TAB.HOME_TAB}
      screenOptions={{
        headerShown: false,
      }}>
      {/* <BottomTab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.TARGET_TAB}
        key={STACK_NAVIGATOR.BOTTOM_TAB.TARGET_TAB}
        component={StudyRoadmapScreen}
      /> */}
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
        name={STACK_NAVIGATOR.BOTTOM_TAB.HOME_TAB}
        key={STACK_NAVIGATOR.BOTTOM_TAB.HOME_TAB}
        component={HomeStackScreens}
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
// Styles for the custom tabBar and tabBarBackground
const styles = StyleSheet.create({
  tabBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});
