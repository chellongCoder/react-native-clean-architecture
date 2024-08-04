import {useEffect, useState} from 'react';
import {
  blockApps,
  FamilyActivitySelection,
  selectedAppsData,
} from 'react-native-alphadex-screentime';
import {StatusCode} from 'src/authentication/presentation/types/StatusCode';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import {useBlockState} from './useBlockState';

export const useSaveSetting = (hasDataServer: boolean, childrenId: string) => {
  const [isLoading, setisLoading] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const {blocked, setBlocked} = useBlockState();

  useAsyncEffect(async () => {
    if (blocked === false) {
      try {
        const apps = await selectedAppsData(childrenId);
        console.log(
          '🛠 LOG: 🚀 --> ---------------------------------------------🛠 LOG: 🚀 -->',
        );
        console.log(
          '🛠 LOG: 🚀 --> ~ useAsyncEffect ~ apps:',
          apps,
          JSON.parse(apps),
        );
        console.log(
          '🛠 LOG: 🚀 --> ---------------------------------------------🛠 LOG: 🚀 -->',
        );
        const parsedApp: FamilyActivitySelection = JSON.parse(apps);
        if (
          parsedApp.applicationTokens.length > 0 ||
          parsedApp.categoryTokens.length > 0
        ) {
          setErrorMessage('');
        } else if (
          apps.length === 0 ||
          parsedApp.applicationTokens.length === 0 ||
          parsedApp.categoryTokens.length === 0
        ) {
          setErrorMessage(
            'You need to reselect apps to synchronize with system.',
          );
        }
      } catch (error: any) {
        console.log(
          '🛠 LOG: 🚀 --> -----------------------------------------------🛠 LOG: 🚀 -->',
        );
        console.log('🛠 LOG: 🚀 --> ~ useAsyncEffect ~ error:', error);
        console.log(
          '🛠 LOG: 🚀 --> -----------------------------------------------🛠 LOG: 🚀 -->',
        );
        if (error?.code === StatusCode.ERROR_UserDefaults_Empty) {
          setErrorMessage(
            'You need to reselect apps to synchronize with system.',
          );
        }
      }
    }
  }, [blocked, childrenId]);

  return {
    isLoading,
    errorMessage,
    setErrorMessage,
    blocked,
    setBlocked,
  };
};
