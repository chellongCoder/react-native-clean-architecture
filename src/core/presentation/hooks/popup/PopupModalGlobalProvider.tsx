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
    const {userProfile} = useAuthenticationStore();

    const [isShown, setIsShown] = useState(false);

    const show = useCallback(() => {
      setIsShown(true);
    }, []);

    const hide = useCallback(() => {
      setIsShown(false);
    }, []);

    useEffect(() => {
      if (userProfile) {
        setIsShown(!userProfile?.hasFeedBack);
      }
    }, [userProfile]);

    return (
      <PopupModalContext.Provider value={{show, hide, isShown}}>
        {children}
        <ReceivedDiamondPopup isVisible={false} onClose={hide} />
        <FeedbackPopup
          isVisible={isShown}
          onClose={hide}
          onSubmitFeedback={() => {
            /* handle feedback submission */
            hide();
          }}
        />
        {/* Optionally, you can include the modal component here if it should be global */}
      </PopupModalContext.Provider>
    );
  },
);
