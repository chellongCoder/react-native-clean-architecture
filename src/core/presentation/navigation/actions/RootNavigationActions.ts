import {
  DrawerActions,
  NavigationContainerRef,
  NavigationProp,
  ParamListBase,
  StackActions,
  TabActions,
} from '@react-navigation/native';
import {createRef} from 'react';
import {STACK_NAVIGATOR} from '../ConstantNavigator';

const navigationRef =
  createRef<NavigationContainerRef<typeof STACK_NAVIGATOR>>();

export const navigateScreen = <T>(screen: string, params: T): void => {
  try {
    navigationRef.current?.navigate(screen, params as any);
  } catch (error) {
    console.log('RootNavigation - function navigateScreen crash');
  }
};
export const pushScreen = <T>(screen: string, params: T): void => {
  try {
    navigationRef.current?.dispatch(StackActions.push(screen, params as any));
  } catch (error) {
    console.log('RootNavigation - function navigateScreen crash');
  }
};

export const replaceScreen = <T>(screen: string, params?: T): void => {
  navigationRef.current?.dispatch(StackActions.replace(screen, params as any));
};
export const goBack = (): void => {
  navigationRef.current?.canGoBack() && navigationRef.current?.goBack();
};

export const resetNavigator = <T>(screen: string, params?: T): void =>
  navigationRef.current?.reset({
    index: 0,
    routes: [{name: screen, params}],
  });

export const backToTopScreen = (): void =>
  navigationRef.current?.dispatch(StackActions.popToTop());

export const backToOthersScreen = (key: number | undefined): void =>
  navigationRef.current?.dispatch(StackActions.pop(key));

export const jumpToTab = (screen: string, params = {}): void =>
  navigationRef.current?.dispatch(TabActions.jumpTo(screen, params));

export const openDrawer = (): void => {
  navigationRef.current?.dispatch(DrawerActions.toggleDrawer());
};

export const hideBottomTab = (
  navigation: NavigationProp<ParamListBase>,
): void => {
  const parent = navigation?.getParent();
  parent &&
    parent.setOptions &&
    parent.setOptions({
      tabBarVisible: false,
    });
};
export const showBottomTab = (
  navigation: NavigationProp<ParamListBase>,
): void => {
  const parent = navigation?.getParent();
  parent &&
    parent.setOptions &&
    parent.setOptions({
      tabBarVisible: true,
    });
};
export default navigationRef;
