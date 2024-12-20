import {observer} from 'mobx-react';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {Platform} from 'react-native';
import {ForceUpdateAppResponse} from 'src/authentication/application/types/ForceUpdateAppResponse';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import FeedbackPopup from 'src/core/components/popup/FeedbackPopup';
import ForceUpdateAppPopup from 'src/core/components/popup/ForceUpdateAppPopup';
import ReceivedDiamondPopup from 'src/core/components/popup/ReceivedDiamondPopup';
import useStateCustom from 'src/hooks/useStateCommon';
import {getVersion} from 'react-native-device-info';
import DeviceInfo from 'react-native-device-info';
import {useAsyncEffect} from '..';
import {useNavigationState} from '@react-navigation/native';
import {STACK_NAVIGATOR} from '../../navigation/ConstantNavigator';

// Define the context type
type PopupModalContextType = {
  show: () => void;
  hide: () => void;
  isShown: boolean;
};

// Create the context
export const PopupModalContext = createContext<PopupModalContextType>({
  show: () => {},
  hide: () => {},
  isShown: false,
});

type TPopupState = {
  isShowFeedBack?: boolean;
  isShowReceived?: boolean;
  isShowForceUpdateApp?: boolean;
  appInfo?: ForceUpdateAppResponse['data'];
};

// Define the provider component
export const PopupModalGlobalProvider = observer(
  ({children}: PropsWithChildren) => {
    const currentRoute = useNavigationState(
      state => state?.routes?.[state?.index]?.name,
    );

    const [isShown, setIsShown] = useState(false);
    const [popupState, setPopupState] = useStateCustom<TPopupState>({
      isShowFeedBack: false,
      isShowReceived: false,
      isShowForceUpdateApp: false,
      appInfo: undefined,
    });

    const {userProfile, handleGetForceUpdateApp} = useAuthenticationStore();

    const show = useCallback(() => {
      setIsShown(true);
    }, []);

    const hide = useCallback(() => {
      setIsShown(false);
    }, []);

    const onShowReceived = useCallback(
      ({
        isShowFeedBack,
        isShowReceived,
      }: {
        isShowFeedBack: boolean;
        isShowReceived: boolean;
      }) => {
        setPopupState({
          isShowFeedBack: isShowFeedBack,
          isShowReceived: isShowReceived,
        });
      },
      [setPopupState],
    );

    const getUpdateAppInfo = async () => {
      try {
        const res = await handleGetForceUpdateApp({platform: Platform.OS});
        if (res) {
          setPopupState({appInfo: res});
        }
      } catch (error) {
        console.log('getUpdateAppInfo error: ', error);
      }
    };

    const getFeedbackInfo = async () => {
      const buildId = await DeviceInfo.getBuildNumber();

      if (
        popupState.appInfo &&
        popupState.appInfo?.version ===
          getVersion().toString() + buildId.toString()
      ) {
        setPopupState({isShowForceUpdateApp: true});
      } else if (userProfile) {
        setPopupState({
          isShowFeedBack: !userProfile?.isReported,
          isShowReceived: false,
        });
      }
    };

    useAsyncEffect(async () => {
      getUpdateAppInfo();
    }, []);

    useEffect(() => {
      if (currentRoute === STACK_NAVIGATOR.BOTTOM_TAB_SCREENS) {
        getFeedbackInfo();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRoute]);

    return (
      <PopupModalContext.Provider value={{show, hide, isShown}}>
        {children}
        <ReceivedDiamondPopup
          isVisible={popupState.isShowReceived || false}
          onClose={({isShowFeedBack, isShowReceived}) => {
            setPopupState({isShowFeedBack, isShowReceived});
          }}
        />
        <FeedbackPopup
          isVisible={popupState.isShowFeedBack || false}
          onClose={onShowReceived}
        />
        <ForceUpdateAppPopup
          isVisible={popupState.isShowForceUpdateApp || false}
          onClose={() => {}}
          storeLink={
            Platform.OS === 'ios'
              ? popupState.appInfo?.appStoreLink
              : popupState.appInfo?.playStoreLink
          }
        />
        {/* Optionally, you can include the modal component here if it should be global */}
      </PopupModalContext.Provider>
    );
  },
);
