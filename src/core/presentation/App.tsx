import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
// import GlobalModal from 'services/globalModal';
import RootNavigator from './navigation/RootNavigator';
import RootNavigation from './navigation/actions/RootNavigationActions';
import {screenTracking} from './utils/ScreenTracking';
import {AuthenticationProvider} from 'src/authentication/presentation/stores/AuthenticationProvider';
import {LoadingGlobalProvider} from './hooks/loading/LoadingGlobalProvider';
import Toast from 'react-native-toast-message';
import {requestScreenTime} from 'react-native-alphadex-screentime';
import {isAndroid} from './utils';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
const App = () => {
  const routeNameRef = useRef<string>();

  const onNavigationReady = (): void => {
    const route = RootNavigation.current?.getCurrentRoute();

    if (route) {
      routeNameRef.current = route.name;
      // store?.rootStore?.dispatch(setAppReady());
    }
  };
  const changeRouteName = () => {
    const previousRouteName = routeNameRef.current;
    const currentRoute = RootNavigation.current?.getCurrentRoute();
    if (currentRoute) {
      const currentRouteName = currentRoute.name;
      screenTracking(previousRouteName, currentRouteName);
      routeNameRef.current = currentRouteName;
    }
  };

  useEffect(() => {
    !isAndroid && requestScreenTime();
  }, []);

  return (
    <NavigationContainer
      ref={RootNavigation}
      onReady={onNavigationReady}
      onStateChange={changeRouteName}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GestureHandlerRootView style={{flex: 1}}>
          <LoadingGlobalProvider>
            <AuthenticationProvider>
              <RootNavigator />
              <Toast />
            </AuthenticationProvider>
          </LoadingGlobalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
