import {useEffect, useState} from 'react';
import {
  FamilyActivitySelection,
  selectedAppsData,
} from 'react-native-alphadex-screentime';
import {StatusCode} from 'src/authentication/presentation/types/StatusCode';
import {useAsyncEffect} from 'src/core/presentation/hooks';

export const useSaveSetting = (hasDataServer: boolean, childrenId: string) => {
  const [isLoading, setisLoading] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  useAsyncEffect(async () => {
    if (hasDataServer) {
      try {
        const apps = await selectedAppsData(childrenId);
        const parsedApp: FamilyActivitySelection = JSON.parse(apps);
        console.log(
          '🛠 LOG: 🚀 --> ---------------------------------------------🛠 LOG: 🚀 -->',
        );
        console.log(
          '🛠 LOG: 🚀 --> ~ useAsyncEffect ~ apps:',
          apps,
          apps.length,
          JSON.parse(apps),
        );
        console.log(
          '🛠 LOG: 🚀 --> ---------------------------------------------🛠 LOG: 🚀 -->',
        );
        if (
          apps.length === 0 ||
          parsedApp.applicationTokens.length === 0 ||
          parsedApp.categoryTokens.length === 0
        ) {
          setErrorMessage(
            'You need to reselect apps to synchronize with system.',
          );
        } else if (
          parsedApp.applicationTokens.length > 0 ||
          parsedApp.categoryTokens.length > 0
        ) {
          setErrorMessage(
            'You need to reselect apps after changing children profile',
          );
        } else {
          setErrorMessage('');
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
  }, [hasDataServer]);

  return {
    isLoading,
    errorMessage,
  };
};
