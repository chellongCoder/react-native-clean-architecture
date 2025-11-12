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
import {LoadingGlobalProvider} from './hooks/loading/LoadingGlobalProvider';
import Toast from 'react-native-toast-message';
import {requestScreenTime} from 'react-native-alphadex-screentime';
import {isAndroid} from './utils';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SoundGlobalProvider} from './hooks/sound/SoundGlobalProvider';
import {LogBox, Platform, StatusBar} from 'react-native';
import {SoundBackgroundGlobalProvider} from './hooks/sound/SoundBackgroundGlobalProvider';
import {OfflineProvider} from './hooks/offline/OfflineProvider';
import {TextToSpeechProvider} from './hooks/textToSpeech/TextToSpeechProvider';
import {IapProvider} from './store/iapProvider';
import FirebaseCrashlyticProvider from './hooks/firebaseCrashlytic/FirebaseCrashlyticProvider';
import CodePushProvider from './hooks/useCodePush';
import {withIAPContext} from 'react-native-iap';
import crashlytics from '@react-native-firebase/crashlytics';
import {AuthenticationProvider} from 'src/authentication/presentation/stores/AuthenticationProvider';
import ErrorBoundary from './components/ErrorBoundary';
import SpInAppUpdates, {
  IAUUpdateKind,
  IosStartUpdateOptions,
  AndroidStartUpdateOptions,
  IAUInstallStatus,
} from 'sp-react-native-in-app-updates';
import DeviceInfo from 'react-native-device-info';
import appsFlyer from 'react-native-appsflyer';
import analytics from '@react-native-firebase/analytics';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
  const initializeAppsFlyer = () => {
    appsFlyer.initSdk(
      {
        devKey: 'WgiQWB8TNKSTGf96jjqBXa', // Get from dashboard
        isDebug: !!__DEV__,
        appId: '41*****44', // iOS only
        onInstallConversionDataListener: true, //Optional
        onDeepLinkListener: true, //Optional
        timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
        // CRITICAL: Disable AAID collection
        manualStart: false,
      },
      result => {
        console.log('appsFlyer result: ', result);
      },
      error => {
        console.error('appsFlyer error: ', error);
      },
    );
    // Disable data collection for children
    appsFlyer.anonymizeUser(true);
    // Disable advertising identifier collection
    if(isAndroid) {
      appsFlyer.setCollectAndroidID(false);
      appsFlyer.setCollectIMEI(false);
    }
    
  };

  const routeNameRef = useRef<string>();

  const checkForUpdate = () => {
    const version = DeviceInfo.getVersion();
    const inAppUpdates = new SpInAppUpdates(
      false, // isDebug
    );

    inAppUpdates
      .checkNeedsUpdate({curVersion: version})
      .then(result => {
        if (result.shouldUpdate) {
          let updateOptions: IosStartUpdateOptions | AndroidStartUpdateOptions;
          if (Platform.OS === 'ios') {
            updateOptions = {
              title: 'Update available',
              message:
                'There is a new version of the app available on the App Store, do you want to update it?',
              buttonUpgradeText: 'Update',
              buttonCancelText: 'Cancel',
            };
          } else {
            updateOptions = {
              updateType: IAUUpdateKind.FLEXIBLE,
            };
          }
          inAppUpdates.addStatusUpdateListener(downloadStatus => {
            console.log('download status', downloadStatus);
            if (downloadStatus.status === IAUInstallStatus.DOWNLOADED) {
              console.log('downloaded');
              inAppUpdates.installUpdate();
              inAppUpdates.removeStatusUpdateListener(finalStatus => {
                console.log('final status', finalStatus);
              });
            }
          });
          inAppUpdates.startUpdate(updateOptions);
        }
      })
      .catch(err => {
        console.log('checkForUpdate err: ', err);
      });
  };

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
    initializeAppsFlyer();
  }, []);

  useEffect(() => {
    crashlytics().log('App mounted.');
    // When user is under 13:
    analytics().setAnalyticsCollectionEnabled(false);
    !isAndroid && requestScreenTime();
  }, []);

  useEffect(() => {
    if (__DEV__) {
      return;
    } else {
      checkForUpdate();
    }
  }, []);

  return (
    <NavigationContainer
      ref={RootNavigation}
      onReady={onNavigationReady}
      onStateChange={changeRouteName}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GestureHandlerRootView style={{flex: 1}}>
          <LoadingGlobalProvider>
            <FirebaseCrashlyticProvider>
              <OfflineProvider>
                <SoundGlobalProvider>
                  <SoundBackgroundGlobalProvider>
                    <TextToSpeechProvider>
                      <AuthenticationProvider>
                        <IapProvider>
                          <CodePushProvider>
                            <ErrorBoundary>
                              <RootNavigator />
                            </ErrorBoundary>
                            <Toast />
                          </CodePushProvider>
                        </IapProvider>
                      </AuthenticationProvider>
                    </TextToSpeechProvider>
                  </SoundBackgroundGlobalProvider>
                </SoundGlobalProvider>
              </OfflineProvider>
            </FirebaseCrashlyticProvider>
          </LoadingGlobalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default withIAPContext(App);
