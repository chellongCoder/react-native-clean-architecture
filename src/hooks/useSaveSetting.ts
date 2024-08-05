import {useEffect, useState} from 'react';
import {
  blockApps,
  FamilyActivitySelection,
  selectedAppsData,
} from 'react-native-alphadex-screentime';
import {StatusCode} from 'src/authentication/presentation/types/StatusCode';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import {useBlockState} from './useBlockState';

/**
 * Custom hook for saving settings.
 *
 * @param hasDataServer - A boolean indicating whether there is a data server.
 * @param childrenId - The ID of the children.
 * @returns An object containing the state and functions related to saving settings.
 */
export const useSaveSetting = (hasDataServer: boolean, childrenId: string) => {
  const [isLoading, setisLoading] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const {blocked, setBlocked} = useBlockState();

  useAsyncEffect(async () => {
    /**-----------------------------------------------------------------------------------------------------------------------
     *todo                                                 TODO HEADER
     check xem có đang block ở trên native hay ko.
     *-----------------------------------------------------------------------------------------------------------------------**/
    if (blocked === false) {
      try {
        /**----------------------
         *todo    lấy ra các app đã được chọn theo childrenId
         *------------------------**/
        const apps = await selectedAppsData(childrenId);
        const parsedApp: FamilyActivitySelection = JSON.parse(apps);
        /*------------------------**/

        /**-----------------------
         * todo      check điều kiện show error
         *  nếu có apps bị block thì error ko có
         *
         * @else nếu ko có apps nào bị block thì set error
         *------------------------**/
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
