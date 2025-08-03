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
import TrialModulePopup from 'src/core/components/popup/TrialModulePopup';
import BuyMoreModulePopup from 'src/core/components/popup/BuyMoreModulePopup';
import {useSpeechToText} from 'src/lesson/presentation/hooks/useSpeechToText';
import EnableVoiceSettingPopup from 'src/core/components/popup/EnableVoiceSettingPopup';

// Define the context type
type PopupModalContextType = {
  show: () => void;
  hide: () => void;
  isShown: boolean;
  handleToggleTrialPopup: (callback?: () => void) => void;
  handleToggleBuyMoreModulePopup: () => void;
};

// Create the context
export const PopupModalContext = createContext<PopupModalContextType>({
  show: () => {},
  hide: () => {},
  isShown: false,
  handleToggleTrialPopup: () => {},
  handleToggleBuyMoreModulePopup: () => {},
});

type TPopupState = {
  isShowFeedBack?: boolean;
  isShowReceived?: boolean;
  isShowForceUpdateApp?: boolean;
  isShowTrial?: boolean;
  appInfo?: ForceUpdateAppResponse['data'];
  isShowBuyMoreModule?: boolean;
  isShowEnableVoiceSetting?: boolean;
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
      isShowTrial: false,
      appInfo: undefined,
      isShowBuyMoreModule: false,
      isShowEnableVoiceSetting: undefined,
    });

    const {userProfile, handleGetForceUpdateApp} = useAuthenticationStore();
    const {voiceState} = useSpeechToText();

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

    const handleToggleTrialPopup = async (callback?: () => void) => {
      callback?.();
      setPopupState({isShowTrial: !popupState.isShowTrial});
    };

    const handleToggleBuyMoreModulePopup = useCallback(() => {
      setPopupState({isShowBuyMoreModule: !popupState.isShowBuyMoreModule});
    }, [popupState.isShowBuyMoreModule, setPopupState]);

    useAsyncEffect(async () => {
      getUpdateAppInfo();
    }, []);

    useEffect(() => {
      if (currentRoute === STACK_NAVIGATOR.BOTTOM_TAB_SCREENS) {
        getFeedbackInfo();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRoute]);

    useEffect(() => {
      if (voiceState.isVoicePermissionGranted === false) {
        setPopupState({isShowEnableVoiceSetting: true});
      } else if (voiceState.isVoicePermissionGranted) {
        setPopupState({isShowEnableVoiceSetting: false});
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voiceState.isVoicePermissionGranted]);

    return (
      <PopupModalContext.Provider
        value={{
          show,
          hide,
          isShown,
          handleToggleTrialPopup,
          handleToggleBuyMoreModulePopup,
        }}>
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
          onClose={() => {
            setPopupState({isShowForceUpdateApp: false});
          }}
          storeLink={
            Platform.OS === 'ios'
              ? popupState.appInfo?.appStoreLink
              : popupState.appInfo?.playStoreLink
          }
        />
        <TrialModulePopup
          isVisible={popupState.isShowTrial || false}
          onClose={() => {}}
          handleToggleTrialPopup={handleToggleTrialPopup}
        />
        <BuyMoreModulePopup
          isVisible={popupState.isShowBuyMoreModule || false}
          onClose={() => {
            setPopupState({isShowBuyMoreModule: false});
          }}
        />
        <EnableVoiceSettingPopup
          isVisible={popupState.isShowEnableVoiceSetting || false}
          onClose={() => {
            setPopupState({isShowEnableVoiceSetting: false});
          }}
        />
        {/* Optionally, you can include the modal component here if it should be global */}
      </PopupModalContext.Provider>
    );
  },
);
