import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, {FC, useEffect} from 'react';
import AppNavigator from './AppNavigator';
import {STACK_NAVIGATOR} from './ConstantNavigator';
import {useFonts} from '../hooks/useFonts';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';

export const AppStack = createStackNavigator();

const RootNavigator: FC = () => {
  const {getUsernamePasswordInKeychain} = useLoginWithCredentials();
  useFonts();

  useEffect(() => {
    getUsernamePasswordInKeychain();
  }, [getUsernamePasswordInKeychain]);

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

export default RootNavigator;
