import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, {FC, useEffect, useState} from 'react';
import AppNavigator from './AppNavigator';
import {STACK_NAVIGATOR} from './ConstantNavigator';
import {useFonts} from '../hooks/useFonts';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';
import {useOfflineMode} from '../hooks/offline/useOfflineMode';
import {OfflineEnum} from '../hooks/offline/OfflineEnum';
import {replaceScreen} from './actions/RootNavigationActions';
import {withProviders} from '../utils/withProviders';
import {LessonStoreProvider} from 'src/lesson/presentation/stores/LessonStore/LessonStoreProvider';
import {usePermissionApplock} from 'src/hooks/usePermissionApplock';
import useHydration from 'src/hooks/useHydration';

export const AppStack = createStackNavigator();

const RootNavigator: FC = () => {
  const {getUsernamePasswordInKeychain} = useLoginWithCredentials();
  const {isConnected, getData} = useOfflineMode();
  const isHydrated = useHydration();
  useFonts();
  usePermissionApplock();

  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    const getDataFromStore = async () => {
      if (!isConnected) {
        const res = await getData(OfflineEnum.USER_PROFILE);
        setUserProfile(res);
      }
    };

    getDataFromStore();
  }, [getData, isConnected]);

  useEffect(() => {
    if (isConnected !== null && isHydrated) {
      if (isConnected) {
        getUsernamePasswordInKeychain();
      } else {
        if (userProfile) {
          replaceScreen(STACK_NAVIGATOR.AUTH.LIST_CHILDREN_SCREEN);
        } else {
          replaceScreen(STACK_NAVIGATOR.AUTH_NAVIGATOR);
        }
      }
    }
  }, [getUsernamePasswordInKeychain, isConnected, isHydrated, userProfile]);

  return (
    <AppStack.Navigator
      screenOptions={{
        cardOverlayEnabled: true,
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid, // Add this line
      }}
      initialRouteName={STACK_NAVIGATOR.AUTH_NAVIGATOR}>
      {AppNavigator()}
    </AppStack.Navigator>
  );
};

export default withProviders(LessonStoreProvider)(RootNavigator);
