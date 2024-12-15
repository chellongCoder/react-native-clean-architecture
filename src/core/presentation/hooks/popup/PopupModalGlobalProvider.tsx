import {observer} from 'mobx-react';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import FeedbackPopup from 'src/core/components/popup/FeedbackPopup';
import ReceivedDiamondPopup from 'src/core/components/popup/ReceivedDiamondPopup';
import useStateCustom from 'src/hooks/useStateCommon';

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

// Define the provider component
export const PopupModalGlobalProvider = observer(
  ({children}: PropsWithChildren) => {
    const [isShown, setIsShown] = useState(false);
    const [popupState, setPopupState] = useStateCustom({
      isShowFeedBack: false,
      isShowReceived: false,
    });
    const {userProfile} = useAuthenticationStore();

    const show = useCallback(() => {
      setIsShown(true);
    }, []);

    const hide = useCallback(() => {
      setIsShown(false);
    }, []);

    const onShowReceived = useCallback(
      ({isShowFeedBack, isShowReceived}) => {
        setPopupState({isShowFeedBack, isShowReceived});
      },
      [setPopupState],
    );

    useEffect(() => {
      if (userProfile) {
        setPopupState({
          isShowFeedBack: !userProfile?.isReported,
          isShowReceived: false,
        });
      }
    }, [setPopupState, userProfile]);
    return (
      <PopupModalContext.Provider value={{show, hide, isShown}}>
        {children}
        <ReceivedDiamondPopup
          isVisible={popupState.isShowReceived}
          onClose={({isShowFeedBack, isShowReceived}) => {
            setPopupState({isShowFeedBack, isShowReceived});
          }}
        />
        <FeedbackPopup
          isVisible={popupState.isShowFeedBack}
          onClose={onShowReceived}
        />
        {/* Optionally, you can include the modal component here if it should be global */}
      </PopupModalContext.Provider>
    );
  },
);
