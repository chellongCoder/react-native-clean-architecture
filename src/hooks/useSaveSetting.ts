import {useEffect, useState} from 'react';
import {
  FamilyActivitySelection,
  selectedAppsData,
} from 'react-native-alphadex-screentime';
import {useAsyncEffect} from 'src/core/presentation/hooks';

export const useSaveSetting = (hasDataServer: boolean) => {
  const [isLoading, setisLoading] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  useAsyncEffect(async () => {
    if (hasDataServer) {
      try {
        const apps = await selectedAppsData();
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
            'You need to reselect apps after changing the list of apps',
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
      } catch (error) {
        console.log(
          '🛠 LOG: 🚀 --> -----------------------------------------------🛠 LOG: 🚀 -->',
        );
        console.log('🛠 LOG: 🚀 --> ~ useAsyncEffect ~ error:', error);
        console.log(
          '🛠 LOG: 🚀 --> -----------------------------------------------🛠 LOG: 🚀 -->',
        );
      }
    }
  }, [hasDataServer]);

  return {
    isLoading,
    errorMessage,
  };
};
